import { useState } from 'react';
import { HeroSection } from '@/components/movie/HeroSection';
import { TrendingSection } from '@/components/movie/TrendingSection';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { useInfiniteNowPlaying } from '@/hooks/useMovies';
import { useInView } from '@/hooks/useInView';
import { Button } from '@/components/ui/button';

export function HomePage() {
  const { ref: gridRef, inView: gridInView } = useInView();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteNowPlaying(gridInView);

  const [visibleCount, setVisibleCount] = useState(15);

  const allMovies = data?.pages.flatMap((page) => page.results) ?? [];
  const visibleMovies = allMovies.slice(0, visibleCount);

  const canLoadMore = visibleCount < allMovies.length || hasNextPage;

  const handleLoadMore = () => {
    const nextCount = visibleCount + 15;
    setVisibleCount(nextCount);
    if (nextCount > allMovies.length) {
      fetchNextPage();
    }
  };

  return (
    <div className="custom-container bg-black flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Trending Section */}
      <div style={{ marginTop: '-47px', position: 'relative', zIndex: 10 }}>
        <TrendingSection />
      </div>

      {/* New Release */}
      <div className="relative z-10" ref={gridRef}>
        <div className="relative">
          <MovieGrid
            movies={visibleMovies}
            isLoading={!gridInView || isLoading}
            title="New Release"
          />

          {/* Gradient overlay */}
          {canLoadMore && (
            <div
              className="absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{
                height: '600px',
                background:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 40%, #000000 100%)',
              }}
            />
          )}
        </div>

        {/* Load More button */}
        {canLoadMore && (
          <div className="relative h-0">
            <div
              className="absolute left-0 right-0 flex justify-center"
              style={{ top: '-200px', zIndex: 20 }}
            >
              <Button
                type="button"
                variant={'secondary'}
                onClick={handleLoadMore}
                className="w-57.5"
              >
                {isFetchingNextPage ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-neutral-800 border-t-neutral-700 rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Spinner */}
        {isFetchingNextPage && visibleCount >= allMovies.length && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-neutral-25 border-t-neutral-800 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
