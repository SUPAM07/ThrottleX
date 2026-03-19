import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AppProvider } from '@/contexts/AppContext';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import Algorithms from '@/pages/Algorithms';
import Configuration from '@/pages/Configuration';
import LoadTesting from '@/pages/LoadTesting';
import Analytics from '@/pages/Analytics';
import ApiKeys from '@/pages/ApiKeys';
import Adaptive from '@/pages/Adaptive';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/algorithms" element={<Algorithms />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/load-testing" element={<LoadTesting />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/api-keys" element={<ApiKeys />} />
              <Route path="/adaptive" element={<Adaptive />} />
            </Route>
          </Routes>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </AppProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
