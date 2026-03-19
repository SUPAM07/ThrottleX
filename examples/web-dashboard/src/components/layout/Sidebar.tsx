import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Cpu, Settings, Zap, BarChart3, Key, Brain, ChevronLeft,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, shortcut: 'Alt+D' },
  { to: '/algorithms', label: 'Algorithms', icon: Cpu, shortcut: 'Alt+A' },
  { to: '/configuration', label: 'Configuration', icon: Settings, shortcut: 'Alt+C' },
  { to: '/load-testing', label: 'Load Testing', icon: Zap, shortcut: 'Alt+L' },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, shortcut: 'Alt+N' },
  { to: '/api-keys', label: 'API Keys', icon: Key, shortcut: 'Alt+K' },
  { to: '/adaptive', label: 'Adaptive', icon: Brain, shortcut: 'Alt+V' },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useApp();
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex flex-col bg-sidebar border-r border-border transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-border">
        {!sidebarCollapsed && (
          <span className="text-sm font-bold text-primary tracking-tight">Rate Limiter</span>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            'p-1.5 rounded-md hover:bg-accent text-muted-foreground transition-colors',
            sidebarCollapsed && 'mx-auto'
          )}
        >
          <ChevronLeft className={cn('w-4 h-4 transition-transform', sidebarCollapsed && 'rotate-180')} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                sidebarCollapsed && 'justify-center px-2'
              )}
            >
              <item.icon className="w-4.5 h-4.5 shrink-0" style={{ width: 18, height: 18 }} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
