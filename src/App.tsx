import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { AppShell } from '@/AppShell';

// --- Dev tools ---
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((d) => ({ default: d.ReactQueryDevtools }))
    )
  : null;

interface AppProps {
  queryClient: QueryClient;
}

function App({ queryClient }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
      {ReactQueryDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}

export default App;
