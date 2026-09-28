import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { AppShell } from '@/AppShell';
import { HeroImageOverrideProvider, type HeroImageOverride } from '@/context/HeroImageOverride';

// --- Dev tools ---
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((d) => ({ default: d.ReactQueryDevtools }))
    )
  : null;

interface AppProps {
  queryClient: QueryClient;
  heroImageOverride?: HeroImageOverride | null;
}

function App({ queryClient, heroImageOverride = null }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <HeroImageOverrideProvider value={heroImageOverride}>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </HeroImageOverrideProvider>
      {ReactQueryDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}

export default App;
