import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Dialog, DialogContent, DialogHeader, DialogTitle, Select, ScrollArea } from '@/components/ui';
import { Key, Plus, Trash2, Edit2, RefreshCw, Search, Download, MoreVertical, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { setAdminLimit, deleteAdminKey } from '@/services/api';
import { cn, formatNumber, generateId } from '@/lib/utils';

export default function ApiKeys() {
  const { keys, refreshKeys, isBackendConnected, health } = useApp();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formKeyName, setFormKeyName] = useState('');
  const [formLimit, setFormLimit] = useState('100');
  const [formWindow, setFormWindow] = useState('60000');
  const [formAlgo, setFormAlgo] = useState('token_bucket');

  const filteredKeys = keys.filter(k => k.key.toLowerCase().includes(search.toLowerCase()));

  // Stats
  const totalKeys = keys.length;
  const activeKeys = keys.length;
  const expiredKeys = 0;
  const usageThisMonth = keys.reduce((s, k) => s + Number(k.limit || 0), 0);

  const handleGenerate = async () => {
    const newKey = formKeyName || `rl_${Math.random() > 0.5 ? 'prod' : 'dev'}_${generateId()}`;
    try {
      await setAdminLimit({
        key: newKey,
        limit: Number(formLimit),
        windowMs: Number(formWindow),
        algorithm: formAlgo,
      });
      setDialogOpen(false);
      setFormKeyName('');
      await refreshKeys();
    } catch (err) {
      console.error('Failed to generate key:', err);
    }
  };

  const handleDelete = async (key: string) => {
    try {
      await deleteAdminKey(key);
      await refreshKeys();
    } catch (err) {
      console.error('Failed to delete key:', err);
    }
  };

  const handleExport = () => {
    const csv = 'Key Name,Limit,Window,Algorithm,Updated\n' +
      keys.map(k => `${k.key},${k.limit},${k.windowMs},${k.algorithm},${k.updatedAt}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'api-keys.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">API Keys</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage API keys for authentication and access control</p>
      </div>

      {/* Health Banner */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm',
        isBackendConnected
          ? 'bg-green-500/5 border-green-500/20 text-green-700 dark:text-green-400'
          : 'bg-red-500/5 border-red-500/20 text-red-700 dark:text-red-400'
      )}>
        <CheckCircle2 className="w-4 h-4" />
        <span>{isBackendConnected ? 'Connected to backend API' : 'Backend API unavailable'}</span>
        {health?.checks?.redis && (
          <Badge variant={health.checks.redis.status === 'ok' ? 'success' : 'warning'} className="text-[10px]">
            Redis: {health.checks.redis.status?.toUpperCase()}
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Keys" value={totalKeys} color="text-foreground" />
        <StatCard title="Active Keys" value={activeKeys} color="text-green-500" />
        <StatCard title="Expired Keys" value={expiredKeys} color="text-red-500" />
        <StatCard title="Usage This Month" value={usageThisMonth} color="text-blue-500" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-3 h-3 mr-1" /> Generate New Key
        </Button>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-3 h-3 mr-1" /> Export
        </Button>
        <Button variant="outline" onClick={refreshKeys}>
          <RefreshCw className="w-3 h-3 mr-1" /> Refresh
        </Button>
      </div>

      {/* Keys Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-sm font-semibold">API Keys</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Search keys..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 w-56 text-xs" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key Name</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Rate Limit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No API keys found
                  </TableCell>
                </TableRow>
              ) : (
                filteredKeys.map(k => (
                  <TableRow key={k.key}>
                    <TableCell className="font-medium text-sm">{k.key}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      ••••••{k.key.slice(-6)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="success" className="text-[10px]">Active</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(k.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(k.updatedAt).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs">{k.limit} req / {Math.round(Number(k.windowMs) / 1000)}s</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(k.key)} className="h-7 w-7 text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Access Logs (demo) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Access Logs
            <Badge variant="outline" className="text-[10px] ml-auto">⚠️ Demo Data</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            Access logs require a backend endpoint implementation. See roadmap for details.
          </p>
        </CardContent>
      </Card>

      {/* Generate Key Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Key Name (optional)</label>
              <Input value={formKeyName} onChange={e => setFormKeyName(e.target.value)} placeholder="Auto-generated if empty" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Rate Limit</label>
                <Input value={formLimit} onChange={e => setFormLimit(e.target.value)} type="number" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Window (ms)</label>
                <Input value={formWindow} onChange={e => setFormWindow(e.target.value)} type="number" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Algorithm</label>
              <Select value={formAlgo} onValueChange={setFormAlgo} options={[
                { value: 'token_bucket', label: 'Token Bucket' },
                { value: 'sliding_window', label: 'Sliding Window' },
                { value: 'fixed_window', label: 'Fixed Window' },
                { value: 'leaky_bucket', label: 'Leaky Bucket' },
              ]} />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleGenerate}>
                <Key className="w-3 h-3 mr-1" /> Generate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className={cn('text-2xl font-bold', color)}>{formatNumber(value)}</p>
      </CardContent>
    </Card>
  );
}
