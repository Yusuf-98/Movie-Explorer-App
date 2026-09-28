import { Writable } from 'node:stream';
import { StaticRouter } from 'react-router-dom';
import { QueryClientProvider, dehydrate, type DehydratedState } from '@tanstack/react-query';
import { renderToPipeableStream } from 'react-dom/server';
import { createAppQueryClient } from '@/lib/queryClient';
import { trendingMoviesQueryOptions } from '@/hooks/useMovies';
import { AppShell } from '@/AppShell';

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

export async function renderPage(url: string): Promise<RenderResult> {
  const queryClient = createAppQueryClient();

  await queryClient.prefetchQuery(trendingMoviesQueryOptions());

  const html = await renderToStringAllReady(
    <QueryClientProvider client={queryClient}>
      <StaticRouter location={url}>
        <AppShell />
      </StaticRouter>
    </QueryClientProvider>
  );

  return { html, dehydratedState: dehydrate(queryClient) };
}
