import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Slider, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { Zap, Play, Settings, Clock, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { runBenchmark } from '@/services/api';
import { cn, formatNumber, formatDuration } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { BenchmarkResult } from '@/types';

const DURATION_OPTIONS = [
  { value: '5000', label: '5 seconds' },
  { value: '10000', label: '10 seconds' },
  { value: '30000', label: '30 seconds' },
  { value: '60000', label: '60 seconds' },
];

const PATTERN_OPTIONS = [
  { value: 'sustained', label: 'Constant Rate' },
  { value: 'ramp', label: 'Ramp Up' },
  { value: 'spike', label: 'Spike' },
  { value: 'step', label: 'Step Load' },
];

export default function LoadTesting() {
  const [targetKey, setTargetKey] = useState('rl_prod_user123');
  const [requestRate, setRequestRate] = useState(100);
  const [duration, setDuration] = useState('30000');
  const [concurrency, setConcurrency] = useState(10);
  const [pattern, setPattern] = useState('sustained');
  const [algorithm, setAlgorithm] = useState('token_bucket');
  const [tokensPerReq, setTokensPerReq] = useState(1);
  const [delayMs, setDelayMs] = useState(5000);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const [history, setHistory] = useState<BenchmarkResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await runBenchmark({
        scenario: pattern,
        concurrency,
        durationMs: Number(duration),
        algorithm,
      });
      setResult(res);
      setHistory(prev => [res, ...prev.slice(0, 9)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Benchmark failed');
    } finally {
      setRunning(false);
    }
  };

  const latencyData = result ? [
    { name: 'P50', value: result.p50LatencyMs },
    { name: 'P95', value: result.p95LatencyMs },
    { name: 'P99', value: result.p99LatencyMs },
    { name: 'Max', value: result.maxLatencyMs },
  ] : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Load Testing</h1>
        <p className="text-muted-foreground text-sm mt-1">Simulate traffic patterns and test rate limiter performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Config */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              Test Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Target Key</label>
              <Input value={targetKey} onChange={e => setTargetKey(e.target.value)} />
              <p className="text-[10px] text-muted-foreground mt-1">API key to test rate limiting against</p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground font-medium">Request Rate (req/s)</span>
                <span className="font-semibold">{requestRate}</span>
              </div>
              <Slider value={requestRate} onChange={setRequestRate} min={1} max={1000} />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Test Duration</label>
              <Select value={duration} onValueChange={setDuration} options={DURATION_OPTIONS} />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground font-medium">Concurrency Level</span>
                <span className="font-semibold">{concurrency}</span>
              </div>
              <Slider value={concurrency} onChange={setConcurrency} min={1} max={100} />
              <p className="text-[10px] text-muted-foreground mt-1">Number of concurrent clients</p>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Request Pattern</label>
              <Select value={pattern} onValueChange={setPattern} options={PATTERN_OPTIONS} />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full"
            >
              <CardTitle className="text-sm">Advanced Settings</CardTitle>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </CardHeader>
          {showAdvanced && (
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Badge variant="outline" className="text-xs">⚡ {tokensPerReq} token</Badge>
                <Badge variant="outline" className="text-xs">⏱ {delayMs}ms</Badge>
                <Badge variant="outline" className="text-xs">📊 Default</Badge>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Algorithm</label>
                <Select value={algorithm} onValueChange={setAlgorithm} options={[
                  { value: 'token_bucket', label: 'Token Bucket' },
                  { value: 'sliding_window', label: 'Sliding Window' },
                  { value: 'fixed_window', label: 'Fixed Window' },
                  { value: 'leaky_bucket', label: 'Leaky Bucket' },
                ]} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tokens per Request</label>
                <Input type="number" value={tokensPerReq} onChange={e => setTokensPerReq(Number(e.target.value))} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Delay Between Requests (ms)</label>
                <Input type="number" value={delayMs} onChange={e => setDelayMs(Number(e.target.value))} />
              </div>
            </CardContent>
          )}
          {!showAdvanced && (
            <CardContent>
              <div className="flex gap-3">
                <Badge variant="outline" className="text-xs">⚡ {tokensPerReq} token</Badge>
                <Badge variant="outline" className="text-xs">⏱ {delayMs}ms</Badge>
                <Badge variant="outline" className="text-xs">📊 Default</Badge>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Start Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleStart}
          disabled={running}
          className={cn('px-8 py-3 text-base', running && 'animate-pulse')}
        >
          <Play className="w-4 h-4 mr-2" />
          {running ? 'Running...' : 'Start Load Test'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Test Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ResultCard label="Total Requests" value={formatNumber(result.totalRequests)} />
            <ResultCard label="Actual RPS" value={formatNumber(result.actualRps)} />
            <ResultCard label="Success Rate" value={`${((result.allowedRequests / result.totalRequests) * 100).toFixed(1)}%`} color="text-green-500" />
            <ResultCard label="Error Rate" value={`${(result.errorRate * 100).toFixed(1)}%`} color="text-red-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Latency Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={latencyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Detailed Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <MetricRow label="Duration" value={formatDuration(result.durationMs)} />
                  <MetricRow label="Allowed" value={formatNumber(result.allowedRequests)} color="text-green-500" />
                  <MetricRow label="Rejected" value={formatNumber(result.rejectedRequests)} color="text-red-500" />
                  <MetricRow label="P50 Latency" value={formatDuration(result.p50LatencyMs)} />
                  <MetricRow label="P95 Latency" value={formatDuration(result.p95LatencyMs)} />
                  <MetricRow label="P99 Latency" value={formatDuration(result.p99LatencyMs)} />
                  <MetricRow label="Max Latency" value={formatDuration(result.maxLatencyMs)} />
                  {result.algorithm && <MetricRow label="Algorithm" value={result.algorithm.replace(/_/g, ' ')} />}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Test History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">#{history.length - i}</span>
                    <Badge variant="outline" className="text-[10px]">{h.scenario}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span>{formatNumber(h.totalRequests)} reqs</span>
                    <span>{formatNumber(h.actualRps)} rps</span>
                    <span className="text-green-500">{((h.allowedRequests / h.totalRequests) * 100).toFixed(0)}%</span>
                    <span>P95: {formatDuration(h.p95LatencyMs)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ResultCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className={cn('text-2xl font-bold', color || 'text-foreground')}>{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

function MetricRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn('text-sm font-semibold', color)}>{value}</span>
    </div>
  );
}
