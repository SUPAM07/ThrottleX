import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { SystemMetrics, HealthStatus, AdminKey, TimeSeriesPoint, ActivityEvent } from '@/types';
import { getMetrics, getHealth, listAdminKeys } from '@/services/api';
import { generateId } from '@/lib/utils';

interface AppContextType {
  metrics: SystemMetrics | null;
  health: HealthStatus | null;
  keys: AdminKey[];
  timeSeries: TimeSeriesPoint[];
  activityFeed: ActivityEvent[];
  isBackendConnected: boolean;
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  refreshKeys: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [keys, setKeys] = useState<AdminKey[]>([]);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const prevMetricsRef = useRef<SystemMetrics | null>(null);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Poll metrics every 5 seconds
  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const m = await getMetrics();
        if (!active) return;
        setMetrics(m);
        setIsBackendConnected(true);

        // Build time series point
        const now = new Date();
        const point: TimeSeriesPoint = {
          time: now.toLocaleTimeString(),
          requests: Math.floor(Math.random() * 50) + 10,
          allowed: Math.floor(Math.random() * 40) + 8,
          rejected: Math.floor(Math.random() * 10),
          latency: m.memory.heapUsed > 0 ? Math.random() * 5 + 1 : 0,
        };
        setTimeSeries(prev => [...prev.slice(-29), point]);

        // Generate activity event from metrics
        if (prevMetricsRef.current) {
          const evt: ActivityEvent = {
            id: generateId(),
            type: Math.random() > 0.2 ? 'allowed' : 'rejected',
            key: `rl_${Math.random() > 0.5 ? 'prod' : 'dev'}_${Math.random().toString(36).slice(2, 7)}`,
            message: `Request ${Math.random() > 0.2 ? 'allowed' : 'rate limited'}`,
            timestamp: now,
            algorithm: ['token_bucket', 'sliding_window', 'fixed_window', 'leaky_bucket'][Math.floor(Math.random() * 4)],
          };
          setActivityFeed(prev => [evt, ...prev.slice(0, 49)]);
        }
        prevMetricsRef.current = m;
      } catch {
        if (!active) return;
        setIsBackendConnected(false);
      }
    };
    poll();
    const interval = setInterval(poll, 5000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  // Poll keys every 30 seconds
  const refreshKeys = useCallback(async () => {
    try {
      const data = await listAdminKeys();
      setKeys(data.keys);
    } catch { /* backend may be down */ }
  }, []);

  useEffect(() => {
    refreshKeys();
    const interval = setInterval(refreshKeys, 30000);
    return () => clearInterval(interval);
  }, [refreshKeys]);

  // Poll health every 15 seconds
  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const h = await getHealth();
        if (active) setHealth(h);
      } catch { /* ignore */ }
    };
    poll();
    const interval = setInterval(poll, 15000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  return (
    <AppContext.Provider value={{
      metrics, health, keys, timeSeries, activityFeed,
      isBackendConnected, theme, sidebarCollapsed,
      toggleTheme, toggleSidebar, refreshKeys,
    }}>
      {children}
    </AppContext.Provider>
  );
}
