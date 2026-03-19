import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

export default function MainLayout() {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn('transition-all duration-300', sidebarCollapsed ? 'ml-16' : 'ml-56')}>
        <TopNav />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
