import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui';
import { Settings, Plus, Trash2, Edit2, Save, Search, Download, Upload } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { setAdminLimit, deleteAdminKey as deleteKey } from '@/services/api';
import { cn } from '@/lib/utils';
import type { AdminKey } from '@/types';

const ALGO_OPTIONS = [
  { value: 'token_bucket', label: 'Token Bucket' },
  { value: 'sliding_window', label: 'Sliding Window' },
  { value: 'fixed_window', label: 'Fixed Window' },
  { value: 'leaky_bucket', label: 'Leaky Bucket' },
];

export default function Configuration() {
  const { keys, refreshKeys } = useApp();
  const [globalCapacity, setGlobalCapacity] = useState('10');
  const [globalRefillRate, setGlobalRefillRate] = useState('5');
  const [globalCleanup, setGlobalCleanup] = useState('300');
  const [globalAlgorithm, setGlobalAlgorithm] = useState('token_bucket');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editKey, setEditKey] = useState<AdminKey | null>(null);

  // Form state
  const [formKey, setFormKey] = useState('');
  const [formLimit, setFormLimit] = useState('10');
  const [formWindow, setFormWindow] = useState('60000');
  const [formAlgo, setFormAlgo] = useState('token_bucket');

  const filteredKeys = keys.filter(k => k.key.toLowerCase().includes(search.toLowerCase()));

  // Pattern-based config (demo data)
  const [patterns] = useState([
    { pattern: 'rl_prod_*', capacity: 100, refillRate: 50, algorithm: 'token_bucket' },
    { pattern: 'rl_dev_*', capacity: 20, refillRate: 10, algorithm: 'sliding_window' },
  ]);
  const [patternSearch, setPatternSearch] = useState('');
  const filteredPatterns = patterns.filter(p => p.pattern.includes(patternSearch));

  const openAdd = () => {
    setEditKey(null);
    setFormKey('');
    setFormLimit('10');
    setFormWindow('60000');
    setFormAlgo('token_bucket');
    setDialogOpen(true);
  };

  const openEdit = (k: AdminKey) => {
    setEditKey(k);
    setFormKey(k.key);
    setFormLimit(k.limit);
    setFormWindow(k.windowMs);
    setFormAlgo(k.algorithm);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      await setAdminLimit({
        key: formKey,
        limit: Number(formLimit),
        windowMs: Number(formWindow),
        algorithm: formAlgo,
      });
      setDialogOpen(false);
      await refreshKeys();
    } catch (err) {
      console.error('Failed to save config:', err);
    }
  };

  const handleDelete = async (key: string) => {
    try {
      await deleteKey(key);
      await refreshKeys();
    } catch (err) {
      console.error('Failed to delete key:', err);
    }
  };

  const handleExport = () => {
    const data = JSON.stringify({ globalConfig: { capacity: globalCapacity, refillRate: globalRefillRate, cleanup: globalCleanup, algorithm: globalAlgorithm }, keys, patterns }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'rate-limiter-config.json'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Configuration Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage rate limiting rules with flexible hierarchical configuration</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-3 h-3 mr-1" /> Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-3 h-3 mr-1" /> Import
          </Button>
        </div>
      </div>

      {/* Global Default Config */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            Global Default Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Default Capacity</label>
              <Input value={globalCapacity} onChange={e => setGlobalCapacity(e.target.value)} type="number" />
              <p className="text-[10px] text-muted-foreground mt-1">Maximum requests or tokens allowed</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Default Refill Rate</label>
              <Input value={globalRefillRate} onChange={e => setGlobalRefillRate(e.target.value)} type="number" />
              <p className="text-[10px] text-muted-foreground mt-1">Tokens per second or window size</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Cleanup Interval (seconds)</label>
              <Input value={globalCleanup} onChange={e => setGlobalCleanup(e.target.value)} type="number" />
              <p className="text-[10px] text-muted-foreground mt-1">How often to clean up expired entries</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Default Algorithm</label>
              <Select value={globalAlgorithm} onValueChange={setGlobalAlgorithm} options={ALGO_OPTIONS} />
              <p className="text-[10px] text-muted-foreground mt-1">Default rate limiting algorithm</p>
            </div>
          </div>
          <Button className="mt-4" size="sm">
            <Save className="w-3 h-3 mr-1" /> Update Defaults
          </Button>
        </CardContent>
      </Card>

      {/* Per-Key Config */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-sm font-semibold">Per-Key Configuration</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <Input placeholder="Search keys..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 w-48 text-xs" />
              </div>
              <Button size="sm" onClick={openAdd}>
                <Plus className="w-3 h-3 mr-1" /> Add Key
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key Name</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Refill Rate</TableHead>
                <TableHead>Algorithm</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No configurations found
                  </TableCell>
                </TableRow>
              ) : (
                filteredKeys.map(k => (
                  <TableRow key={k.key}>
                    <TableCell className="font-mono text-xs">{k.key}</TableCell>
                    <TableCell>{k.limit}</TableCell>
                    <TableCell>{Math.round(Number(k.windowMs) / 1000)}s window</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] capitalize">{k.algorithm.replace(/_/g, ' ')}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(k.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(k)} className="h-7 w-7">
                        <Edit2 className="w-3 h-3" />
                      </Button>
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

      {/* Pattern-Based Config */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              Pattern-Based Configuration <Badge variant="secondary" className="text-[10px]">✨</Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <Input placeholder="Search patterns..." value={patternSearch} onChange={e => setPatternSearch(e.target.value)} className="pl-8 h-9 w-48 text-xs" />
              </div>
              <Button size="sm" variant="default">
                <Plus className="w-3 h-3 mr-1" /> Add Pattern
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pattern</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Refill Rate</TableHead>
                <TableHead>Algorithm</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatterns.map(p => (
                <TableRow key={p.pattern}>
                  <TableCell className="font-mono text-xs">{p.pattern}</TableCell>
                  <TableCell>{p.capacity}</TableCell>
                  <TableCell>{p.refillRate}/s</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] capitalize">{p.algorithm.replace(/_/g, ' ')}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit2 className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="w-3 h-3" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editKey ? 'Edit Key Configuration' : 'Add Key Configuration'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Key Name</label>
              <Input value={formKey} onChange={e => setFormKey(e.target.value)} disabled={!!editKey} placeholder="e.g., api-user-123" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Limit</label>
                <Input value={formLimit} onChange={e => setFormLimit(e.target.value)} type="number" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Window (ms)</label>
                <Input value={formWindow} onChange={e => setFormWindow(e.target.value)} type="number" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Algorithm</label>
              <Select value={formAlgo} onValueChange={setFormAlgo} options={ALGO_OPTIONS} />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>
                <Save className="w-3 h-3 mr-1" /> Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
