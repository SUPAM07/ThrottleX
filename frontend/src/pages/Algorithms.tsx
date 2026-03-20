import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Select, Slider, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw, Cpu } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from 'recharts';
import type { AlgorithmType, TrafficPattern, SimulationDataPoint } from '@/types';

// ─── Algorithm Simulator ───
class AlgorithmSimulator {
  private tokens: number;
  private lastRefill: number;
  private windowCounts: Map<number, number> = new Map();
  private slidingLog: number[] = [];
  private leakyQueue: number = 0;
  private lastLeak: number;

  constructor(private capacity: number, private refillRate: number, private windowMs: number) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
    this.lastLeak = Date.now();
  }

  checkTokenBucket(): boolean {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
    if (this.tokens >= 1) { this.tokens -= 1; return true; }
    return false;
  }

  checkSlidingWindow(): boolean {
    const now = Date.now();
    this.slidingLog = this.slidingLog.filter(t => t > now - this.windowMs);
    if (this.slidingLog.length < this.capacity) { this.slidingLog.push(now); return true; }
    return false;
  }

  checkFixedWindow(): boolean {
    const now = Date.now();
    const windowKey = Math.floor(now / this.windowMs);
    const count = this.windowCounts.get(windowKey) || 0;
    // Cleanup old windows
    for (const k of this.windowCounts.keys()) {
      if (k < windowKey - 1) this.windowCounts.delete(k);
    }
    if (count < this.capacity) { this.windowCounts.set(windowKey, count + 1); return true; }
    return false;
  }

  checkLeakyBucket(): boolean {
    const now = Date.now();
    const elapsed = (now - this.lastLeak) / 1000;
    this.leakyQueue = Math.max(0, this.leakyQueue - elapsed * this.refillRate);
    this.lastLeak = now;
    if (this.leakyQueue < this.capacity) { this.leakyQueue += 1; return true; }
    return false;
  }

  check(algorithm: AlgorithmType): boolean {
    switch (algorithm) {
      case 'token_bucket': return this.checkTokenBucket();
      case 'sliding_window': return this.checkSlidingWindow();
      case 'fixed_window': return this.checkFixedWindow();
      case 'leaky_bucket': return this.checkLeakyBucket();
    }
  }

  getTokenLevel(algorithm: AlgorithmType): number {
    switch (algorithm) {
      case 'token_bucket': return this.tokens;
      case 'sliding_window': return this.capacity - this.slidingLog.length;
      case 'fixed_window': {
        const wk = Math.floor(Date.now() / this.windowMs);
        return this.capacity - (this.windowCounts.get(wk) || 0);
      }
      case 'leaky_bucket': return this.capacity - this.leakyQueue;
    }
  }

  reset() {
    this.tokens = this.capacity;
    this.lastRefill = Date.now();
    this.windowCounts.clear();
    this.slidingLog = [];
    this.leakyQueue = 0;
    this.lastLeak = Date.now();
  }
}

const ALGORITHMS: { value: AlgorithmType; label: string }[] = [
  { value: 'token_bucket', label: 'Token Bucket' },
  { value: 'sliding_window', label: 'Sliding Window' },
  { value: 'fixed_window', label: 'Fixed Window' },
  { value: 'leaky_bucket', label: 'Leaky Bucket' },
];

const PATTERNS: { value: TrafficPattern; label: string }[] = [
  { value: 'steady', label: 'Steady' },
  { value: 'bursty', label: 'Bursty' },
  { value: 'spike', label: 'Spike' },
];

function generateTraffic(pattern: TrafficPattern, tick: number): number {
  switch (pattern) {
    case 'steady': return 3;
    case 'bursty': return tick % 10 < 3 ? 8 : 1;
    case 'spike': return tick % 20 === 10 ? 15 : 2;
    default: return 3;
  }
}

export default function Algorithms() {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('token_bucket');
  const [pattern, setPattern] = useState<TrafficPattern>('steady');
  const [capacity, setCapacity] = useState(20);
  const [refillRate, setRefillRate] = useState(5);
  const [running, setRunning] = useState(false);
  const [data, setData] = useState<SimulationDataPoint[]>([]);
  const [stats, setStats] = useState({ total: 0, allowed: 0, rejected: 0 });
  const [tab, setTab] = useState('simulation');

  const simRef = useRef<AlgorithmSimulator | null>(null);
  const tickRef = useRef(0);

  const reset = useCallback(() => {
    simRef.current = new AlgorithmSimulator(capacity, refillRate, 1000);
    tickRef.current = 0;
    setData([]);
    setStats({ total: 0, allowed: 0, rejected: 0 });
  }, [capacity, refillRate]);

  useEffect(() => { reset(); }, [reset]);

  useEffect(() => {
    if (!running || !simRef.current) return;
    const interval = setInterval(() => {
      const sim = simRef.current!;
      const requests = generateTraffic(pattern, tickRef.current);
      let allowed = 0, rejected = 0;
      for (let i = 0; i < requests; i++) {
        if (sim.check(algorithm)) allowed++; else rejected++;
      }
      tickRef.current++;
      const point: SimulationDataPoint = {
        time: tickRef.current,
        tokens: Math.max(0, sim.getTokenLevel(algorithm)),
        allowed,
        rejected,
        total: requests,
      };
      setData(prev => [...prev.slice(-59), point]);
      setStats(prev => ({
        total: prev.total + requests,
        allowed: prev.allowed + allowed,
        rejected: prev.rejected + rejected,
      }));
    }, 200);
    return () => clearInterval(interval);
  }, [running, algorithm, pattern]);

  const rejectionRate = stats.total > 0 ? ((stats.rejected / stats.total) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Algorithms</h1>
        <p className="text-muted-foreground text-sm mt-1">Interactive algorithm comparison and visualization</p>
      </div>

      <Badge variant="outline" className="text-xs">
        🎓 Educational Client-Side Simulation — Not connected to backend
      </Badge>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="simulation">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Algorithm</label>
                  <Select value={algorithm} onValueChange={(v) => { setAlgorithm(v as AlgorithmType); reset(); }} options={ALGORITHMS} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Traffic Pattern</label>
                  <Select value={pattern} onValueChange={(v) => setPattern(v as TrafficPattern)} options={PATTERNS} />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted-foreground font-medium">Capacity</span>
                    <span className="font-semibold">{capacity}</span>
                  </div>
                  <Slider value={capacity} onChange={(v) => { setCapacity(v); reset(); }} min={5} max={100} />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted-foreground font-medium">Refill Rate</span>
                    <span className="font-semibold">{refillRate}/s</span>
                  </div>
                  <Slider value={refillRate} onChange={(v) => { setRefillRate(v); reset(); }} min={1} max={50} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setRunning(!running)} className="flex-1" size="sm">
                    {running ? <><Pause className="w-3 h-3 mr-1" /> Pause</> : <><Play className="w-3 h-3 mr-1" /> Start</>}
                  </Button>
                  <Button variant="outline" onClick={() => { setRunning(false); reset(); }} size="sm">
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chart + Stats */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Token Level Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                        <Line type="monotone" dataKey="tokens" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="allowed" stroke="#10b981" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total Requests</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-500">{stats.allowed}</p>
                    <p className="text-xs text-muted-foreground">Allowed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-red-500">{rejectionRate}%</p>
                    <p className="text-xs text-muted-foreground">Rejection Rate</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <ComparisonView capacity={capacity} refillRate={refillRate} pattern={pattern} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ComparisonView({ capacity, refillRate, pattern }: { capacity: number; refillRate: number; pattern: TrafficPattern }) {
  const [results, setResults] = useState<{ algorithm: string; allowed: number; rejected: number; total: number }[]>([]);

  useEffect(() => {
    const algos: AlgorithmType[] = ['token_bucket', 'sliding_window', 'fixed_window', 'leaky_bucket'];
    const res = algos.map(algo => {
      const sim = new AlgorithmSimulator(capacity, refillRate, 1000);
      let allowed = 0, rejected = 0, total = 0;
      for (let t = 0; t < 100; t++) {
        const reqs = generateTraffic(pattern, t);
        for (let i = 0; i < reqs; i++) {
          total++;
          if (sim.check(algo)) allowed++; else rejected++;
        }
      }
      return { algorithm: algo.replace(/_/g, ' '), allowed, rejected, total };
    });
    setResults(res);
  }, [capacity, refillRate, pattern]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Algorithm Comparison (100 ticks)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={results}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="algorithm" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
              <Legend />
              <Bar dataKey="allowed" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
