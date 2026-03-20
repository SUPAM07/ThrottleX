import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { cn, formatNumber } from '@/lib/utils';
import { BarChart3, TrendingUp, AlertTriangle, Download, Calendar, Key } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';

// Generate demo analytics data
function generateDemoData(range: string) {
  const points = range === '1h' ? 12 : range === '24h' ? 24 : range === '7d' ? 7 : 30;
  const multiplier = range === '1h' ? 1 : range === '24h' ? 24 : range === '7d' ? 168 : 720;
  const base = 30000 * multiplier;

  const timeSeries = Array.from({ length: points }, (_, i) => {
    const requests = base + Math.floor(Math.random() * base * 0.3);
    const rejections = Math.floor(requests * (Math.random() * 0.05 + 0.01));
    return {
      time: range === '1h' ? `${i * 5}m` : range === '24h' ? `${i}:00` : range === '7d' ? `Day ${i + 1}` : `Day ${i + 1}`,
      requests,
      rejections,
    };
  });

  const totalRequests = timeSeries.reduce((s, t) => s + t.requests, 0);
  const totalRejections = timeSeries.reduce((s, t) => s + t.rejections, 0);

  return {
    totalRequests,
    avgSuccessRate: ((totalRequests - totalRejections) / totalRequests * 100),
    peakRps: Math.max(...timeSeries.map(t => t.requests)) / (range === '1h' ? 300 : 3600),
    timeSeries,
    topKeys: [
      { key: 'rl_dev_a6skfd', requests: 103489 + Math.floor(Math.random() * 5000), algorithm: 'leaky_bucket', rejectionRate: 0.05 },
      { key: 'rl_dev_av62bl', requests: 100239 + Math.floor(Math.random() * 5000), algorithm: 'sliding_window', rejectionRate: 0.162 },
      { key: 'rl_dev_1ju5cp', requests: 97064 + Math.floor(Math.random() * 5000), algorithm: 'leaky_bucket', rejectionRate: 0.216 },
      { key: 'rl_prod_nckwg9', requests: 94976 + Math.floor(Math.random() * 5000), algorithm: 'token_bucket', rejectionRate: 0.232 },
      { key: 'rl_prod_xk2m3', requests: 88431 + Math.floor(Math.random() * 5000), algorithm: 'fixed_window', rejectionRate: 0.089 },
    ],
    algorithmPerf: [
      { name: 'Token Bucket', memory: 12, efficiency: 94, throughput: 15200 },
      { name: 'Sliding Window', memory: 28, efficiency: 97, throughput: 12800 },
      { name: 'Fixed Window', memory: 8, efficiency: 89, throughput: 18400 },
      { name: 'Leaky Bucket', memory: 10, efficiency: 92, throughput: 14600 },
    ],
    alerts: [
      { id: 1, severity: 'warning', message: 'Key rl_dev_1ju5cp rejection rate above threshold (21.6%)', time: '15m ago' },
      { id: 2, severity: 'info', message: 'Traffic spike detected on rl_prod_nckwg9 (+45% in last hour)', time: '1h ago' },
      { id: 3, severity: 'warning', message: 'P95 latency increased by 12% for sliding_window algorithm', time: '3h ago' },
    ],
  };
}

const RANGES = [
  { value: '1h', label: 'Last Hour' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
];

const ALGO_COLORS: Record<string, string> = {
  'Token Bucket': '#3b82f6',
  'Sliding Window': '#10b981',
  'Fixed Window': '#f59e0b',
  'Leaky Bucket': '#ef4444',
};

export default function Analytics() {
  const [range, setRange] = useState('24h');
  const data = useMemo(() => generateDemoData(range), [range]);

  const handleExport = (format: 'json' | 'csv') => {
    let content: string, type: string, ext: string;
    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      type = 'application/json';
      ext = 'json';
    } else {
      const headers = 'time,requests,rejections\n';
      const rows = data.timeSeries.map(t => `${t.time},${t.requests},${t.rejections}`).join('\n');
      content = headers + rows;
      type = 'text/csv';
      ext = 'csv';
    }
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `analytics-${range}.${ext}`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Historical performance data and trends analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <Download className="w-3 h-3 mr-1" /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
            <Download className="w-3 h-3 mr-1" /> JSON
          </Button>
        </div>
      </div>

      {/* Demo Data Notice */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3 text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
        <span className="shrink-0">ℹ️</span>
        <span>
          <strong>Demo Data:</strong> This page displays simulated analytics data for preview purposes.
          Historical analytics features require a time-series database backend (InfluxDB, Prometheus, or TimescaleDB) with data aggregation endpoints. See the <span className="underline cursor-pointer">Analytics Roadmap</span> for implementation details.
        </span>
      </div>

      {/* Time Range */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Time Range:</span>
        {RANGES.map(r => (
          <Button
            key={r.value}
            variant={range === r.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRange(r.value)}
            className="text-xs"
          >
            {r.label}
          </Button>
        ))}
        <Button variant="outline" size="sm" className="text-xs ml-2">
          <Calendar className="w-3 h-3 mr-1" /> Custom Range
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="metric-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Requests</span>
              <BarChart3 className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">{formatNumber(data.totalRequests)}</p>
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +8.8% vs previous period
            </p>
          </CardContent>
        </Card>
        <Card className="metric-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Average Success Rate</span>
              <BarChart3 className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{data.avgSuccessRate.toFixed(1)}%</p>
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +2.4% vs previous period
            </p>
          </CardContent>
        </Card>
        <Card className="metric-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Peak RPS</span>
              <BarChart3 className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold">{data.peakRps.toFixed(3)}</p>
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +1.4% vs previous period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Usage Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timeSeries}>
                <defs>
                  <linearGradient id="gradReqs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradRejs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                <Legend />
                <Area type="monotone" dataKey="requests" stroke="#3b82f6" fill="url(#gradReqs)" strokeWidth={2} />
                <Area type="monotone" dataKey="rejections" stroke="#ef4444" fill="url(#gradRejs)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Keys + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Active Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              Most Active Keys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topKeys.map((k, i) => (
                <div key={k.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium font-mono">{k.key}</p>
                      <p className="text-xs text-muted-foreground">{formatNumber(k.requests)} requests</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-[10px] capitalize">{k.algorithm.replace(/_/g, ' ')}</Badge>
                    <p className={cn('text-xs mt-1', k.rejectionRate > 0.15 ? 'text-red-500' : 'text-green-500')}>
                      {(k.rejectionRate * 100).toFixed(1)}% rejected
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Smart Alerts
              <Badge variant="warning" className="ml-auto text-[10px]">{data.alerts.length} active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.alerts.map(alert => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <AlertTriangle className={cn('w-4 h-4 mt-0.5 shrink-0', alert.severity === 'warning' ? 'text-amber-500' : 'text-blue-500')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Algorithm Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Algorithm Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.algorithmPerf}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                <Legend />
                <Bar dataKey="efficiency" fill="#10b981" name="Efficiency %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="memory" fill="#3b82f6" name="Memory MB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
