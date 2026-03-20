import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, Badge, ScrollArea } from '@/components/ui';
import { cn, formatNumber, timeAgo } from '@/lib/utils';
import {
  Activity, Zap, ShieldCheck, Clock, Cpu, CheckCircle2, XCircle,
  TrendingUp, Server,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
const ALGO_COLORS: Record<string, string> = {
  token_bucket: '#3b82f6',
  sliding_window: '#10b981',
  fixed_window: '#f59e0b',
  leaky_bucket: '#ef4444',
};

export default function Dashboard() {
  const { metrics, health, timeSeries, activityFeed, isBackendConnected, keys } = useApp();

  // Calculate stats
  const totalKeys = keys.length;
  const latestPoint = timeSeries[timeSeries.length - 1];
  const requestsPerSecond = latestPoint?.requests || 0;
  const successRate = latestPoint ? (latestPoint.allowed / Math.max(1, latestPoint.requests) * 100).toFixed(1) : '0.0';

  // Algorithm distribution from keys
  const algoCounts: Record<string, number> = {};
  keys.forEach(k => {
    const algo = k.algorithm || 'token_bucket';
    algoCounts[algo] = (algoCounts[algo] || 0) + 1;
  });
  const algoData = Object.entries(algoCounts).map(([name, value]) => ({ name, value }));
  if (algoData.length === 0) {
    algoData.push(
      { name: 'token_bucket', value: 4 },
      { name: 'sliding_window', value: 3 },
      { name: 'fixed_window', value: 2 },
      { name: 'leaky_bucket', value: 1 },
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time monitoring and system overview</p>
      </div>

      {/* Health Banner */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border',
        isBackendConnected
          ? 'bg-green-500/5 border-green-500/20 text-green-700 dark:text-green-400'
          : 'bg-red-500/5 border-red-500/20 text-red-700 dark:text-red-400'
      )}>
        <Server className="w-4 h-4" />
        <span className="text-sm font-medium">
          {isBackendConnected ? 'Connected to backend API' : 'Backend API unavailable'}
        </span>
        {health?.checks?.redis && (
          <Badge variant={health.checks.redis.status === 'ok' ? 'success' : 'warning'}>
            Redis: {health.checks.redis.status?.toUpperCase()}
          </Badge>
        )}
        {metrics && (
          <span className="text-xs text-muted-foreground ml-auto">
            Uptime: {Math.floor(metrics.uptime / 60)}m | Memory: {metrics.memory.heapUsed}MB
          </span>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Keys"
          value={formatNumber(totalKeys)}
          icon={<Activity className="w-4 h-4" />}
          trend="+2.1%"
          color="text-blue-500"
        />
        <MetricCard
          title="Requests/sec"
          value={formatNumber(requestsPerSecond)}
          icon={<Zap className="w-4 h-4" />}
          trend="+5.3%"
          color="text-amber-500"
        />
        <MetricCard
          title="Success Rate"
          value={`${successRate}%`}
          icon={<ShieldCheck className="w-4 h-4" />}
          trend="+0.4%"
          color="text-green-500"
        />
        <MetricCard
          title="Avg Latency"
          value={`${latestPoint?.latency?.toFixed(1) || '0.0'}ms`}
          icon={<Clock className="w-4 h-4" />}
          trend="-1.2%"
          color="text-purple-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Series Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Request Traffic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeries}>
                  <defs>
                    <linearGradient id="gradAllowed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradRejected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="time" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Area type="monotone" dataKey="allowed" stroke="#10b981" fill="url(#gradAllowed)" strokeWidth={2} />
                  <Area type="monotone" dataKey="rejected" stroke="#ef4444" fill="url(#gradRejected)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              Algorithm Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={algoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="hsl(var(--background))"
                  >
                    {algoData.map((entry, i) => (
                      <Cell key={entry.name} fill={ALGO_COLORS[entry.name] || CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {algoData.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ALGO_COLORS[item.name] || '#888' }} />
                    <span className="text-muted-foreground capitalize">{item.name.replace(/_/g, ' ')}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Activity Feed
            <Badge variant="secondary" className="ml-auto">{activityFeed.length} events</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {activityFeed.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No events yet. Waiting for backend data...</p>
              ) : (
                activityFeed.map(event => (
                  <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    {event.type === 'allowed' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.key}</p>
                      <p className="text-xs text-muted-foreground">{event.message}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {event.algorithm?.replace(/_/g, ' ')}
                      </Badge>
                      <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(event.timestamp)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, color }: {
  title: string; value: string; icon: React.ReactNode; trend: string; color: string;
}) {
  const isPositive = trend.startsWith('+');
  return (
    <Card className="metric-glow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground font-medium">{title}</span>
          <div className={cn('p-2 rounded-lg bg-muted/50', color)}>{icon}</div>
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className={cn('text-xs mt-1 flex items-center gap-1', isPositive ? 'text-green-500' : 'text-red-500')}>
          <TrendingUp className="w-3 h-3" />
          {trend} vs previous period
        </p>
      </CardContent>
    </Card>
  );
}
