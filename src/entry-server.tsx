import { Writable } from 'node:stream';
import { StaticRouter } from 'react-router-dom';
import { QueryClientProvider, dehydrate, type DehydratedState, type QueryClient } from '@tanstack/react-query';
import { renderToPipeableStream } from 'react-dom/server';
import { createAppQueryClient } from '@/lib/queryClient';
import { trendingMoviesQueryOptions } from '@/hooks/useMovies';
import { HeroImageOverrideProvider, type HeroImageOverride } from '@/context/HeroImageOverride';
import { AppShell } from '@/AppShell';
import type { Movie, MovieResponse } from '@/types/movie';

export interface RenderResult {
  html: string;
  dehydratedState: DehydratedState;
}

function renderToStringAllReady(element: React.ReactNode): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const writable = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(chunk);
        callback();
      },
    });

    const { pipe } = renderToPipeableStream(element, {
      onAllReady() {
        pipe(writable);
        writable.on('finish', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      },
      onError(error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    });
  });
}

export async function prefetchTrending(): Promise<{ queryClient: QueryClient; firstMovie: Movie | null }> {
  const queryClient = createAppQueryClient();
  const options = trendingMoviesQueryOptions();

  await queryClient.prefetchQuery(options);

  const data = queryClient.getQueryData<MovieResponse>(options.queryKey);
  return { queryClient, firstMovie: data?.results?.[0] ?? null };
}

export async function renderWithData(
  queryClient: QueryClient,
  heroImageOverride: HeroImageOverride | null,
  url: string
): Promise<RenderResult> {
  const html = await renderToStringAllReady(
    <QueryClientProvider client={queryClient}>
      <HeroImageOverrideProvider value={heroImageOverride}>
        <StaticRouter location={url}>
          <AppShell />
        </StaticRouter>
      </HeroImageOverrideProvider>
    </QueryClientProvider>
  );

  return { html, dehydratedState: dehydrate(queryClient) };
}
