import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Switch, Progress, Select } from '@/components/ui';
import { Brain, RefreshCw, Settings, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';

// Demo adaptive data
function generateAdaptiveData() {
  const modes = ['ADAPTIVE', 'STATIC', 'LEARNING', 'OVERRIDE'] as const;
  const keys = [
    { key: 'rl_prod_api_main', mode: 'ADAPTIVE' as const, confidence: 0.92, currentLimit: 150, baseLimit: 100, reasoning: 'Traffic pattern stable. Increased limit based on 4h window analysis.', lastEval: '2m ago' },
    { key: 'rl_prod_webhook', mode: 'LEARNING' as const, confidence: 0.45, currentLimit: 100, baseLimit: 100, reasoning: 'Collecting baseline data. 450/1000 samples gathered.', lastEval: '30s ago' },
    { key: 'rl_dev_test_user', mode: 'STATIC' as const, confidence: 1.0, currentLimit: 50, baseLimit: 50, reasoning: 'Static configuration. No adaptive adjustments.', lastEval: 'N/A' },
    { key: 'rl_prod_partner_x', mode: 'OVERRIDE' as const, confidence: 0.88, currentLimit: 500, baseLimit: 200, reasoning: 'Manual override: Temporary increase for product launch event.', lastEval: '5m ago' },
    { key: 'rl_prod_mobile_api', mode: 'ADAPTIVE' as const, confidence: 0.78, currentLimit: 120, baseLimit: 100, reasoning: 'Moderate confidence. Slight increase detecting steady growth pattern.', lastEval: '1m ago' },
  ];

  return {
    enabled: true,
    evaluationInterval: 30,
    confidenceThreshold: 0.7,
    maxAdjustmentPercent: 50,
    minSamples: 100,
    keys,
  };
}

const MODE_COLORS: Record<string, string> = {
  ADAPTIVE: 'text-green-500',
  STATIC: 'text-muted-foreground',
  LEARNING: 'text-blue-500',
  OVERRIDE: 'text-amber-500',
};

const MODE_BADGES: Record<string, 'success' | 'secondary' | 'default' | 'warning'> = {
  ADAPTIVE: 'success',
  STATIC: 'secondary',
  LEARNING: 'default',
  OVERRIDE: 'warning',
};

export default function Adaptive() {
  const { isBackendConnected } = useApp();
  const data = useMemo(() => generateAdaptiveData(), []);
  const [overrideKey, setOverrideKey] = useState('');
  const [overrideLimit, setOverrideLimit] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Adaptive Rate Limiting <Badge variant="success" className="text-xs">v1.2</Badge>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">ML-driven adaptive rate limiting with real-time analysis</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-3 h-3 mr-1" /> Refresh
        </Button>
      </div>

      {/* Config Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className={cn('w-3 h-3 rounded-full mx-auto mb-2', data.enabled ? 'bg-green-500' : 'bg-red-500')} />
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="text-sm font-semibold">{data.enabled ? 'Enabled' : 'Disabled'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Eval Interval</p>
            <p className="text-lg font-bold">{data.evaluationInterval}s</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Confidence Threshold</p>
            <p className="text-lg font-bold">{(data.confidenceThreshold * 100).toFixed(0)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Max Adjustment</p>
            <p className="text-lg font-bold">±{data.maxAdjustmentPercent}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Min Samples</p>
            <p className="text-lg font-bold">{data.minSamples}</p>
          </CardContent>
        </Card>
      </div>

      {/* Key Status Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            Key Status
            <Badge variant="secondary" className="ml-auto text-[10px]">{data.keys.length} keys monitored</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Current / Base Limit</TableHead>
                <TableHead>Reasoning</TableHead>
                <TableHead>Last Eval</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.keys.map(k => (
                <TableRow key={k.key}>
                  <TableCell className="font-mono text-xs font-medium">{k.key}</TableCell>
                  <TableCell>
                    <Badge variant={MODE_BADGES[k.mode]} className="text-[10px]">{k.mode}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 w-28">
                      <Progress value={k.confidence * 100} className="h-1.5" />
                      <span className="text-xs font-medium w-10">{(k.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn('text-sm font-semibold', k.currentLimit !== k.baseLimit ? 'text-primary' : '')}>
                      {k.currentLimit}
                    </span>
                    <span className="text-xs text-muted-foreground"> / {k.baseLimit}</span>
                    {k.currentLimit > k.baseLimit && (
                      <TrendingUp className="inline w-3 h-3 text-green-500 ml-1" />
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-muted-foreground max-w-xs truncate">{k.reasoning}</p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{k.lastEval}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Override Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            Manual Override Controls
            <Badge variant="warning" className="text-[10px]">Emergency Use</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Set manual overrides for specific keys. This bypasses the adaptive algorithm and sets a fixed limit.
          </p>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Key</label>
              <Select
                value={overrideKey}
                onValueChange={setOverrideKey}
                options={data.keys.map(k => ({ value: k.key, label: k.key }))}
                placeholder="Select a key..."
              />
            </div>
            <div className="w-32">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">New Limit</label>
              <input
                type="number"
                value={overrideLimit}
                onChange={e => setOverrideLimit(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="500"
              />
            </div>
            <Button variant="destructive" size="default">
              <AlertTriangle className="w-3 h-3 mr-1" /> Set Override
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Notice */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3 text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
        <span className="shrink-0">🆕</span>
        <span>
          <strong>New in v1.2:</strong> Adaptive rate limiting is now fully integrated with the backend engine.
          The ML model analyzes traffic patterns over configurable windows and automatically adjusts rate limits
          based on confidence scores. Manual overrides are available for emergency intervention.
        </span>
      </div>
    </div>
  );
}
