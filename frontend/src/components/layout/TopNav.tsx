import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Sun, Moon, Menu, User } from 'lucide-react';
import { Badge } from '@/components/ui';

export default function TopNav() {
  const { theme, toggleTheme, toggleSidebar, isBackendConnected, health } = useApp();
  const redisStatus = health?.checks?.redis?.status;

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-md hover:bg-accent">
          <Menu className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-semibold text-foreground">Rate Limiter Control Panel</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Connection status */}
        <div className="hidden sm:flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', isBackendConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500')} />
          <span className="text-xs text-muted-foreground">
            {isBackendConnected ? 'Connected' : 'Disconnected'}
          </span>
          {redisStatus && (
            <Badge variant={redisStatus === 'ok' ? 'success' : 'warning'} className="text-[10px]">
              Redis: {redisStatus.toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* User icon */}
        <div className="p-2 rounded-md hover:bg-accent text-muted-foreground">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
