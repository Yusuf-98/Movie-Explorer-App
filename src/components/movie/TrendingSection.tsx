import { useTrendingMovies } from '@/hooks/useMovies';
import { TrendingCard } from './TrendingCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useCarousel } from '../ui/carousel.context';
import arrowRight from '../../assets/icons/arrowcar-right.png';
import arrowLeft from '../../assets/icons/arrowcarleft.png';

function CustomNav() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <>
      {/* Carousel button — left */}
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous"
        className={`absolute left-4 md:-left-16 top-40 -translate-y-1/2 z-110 transition-opacity cursor-pointer bg-black/50 md:bg-transparent rounded-full p-1 ${
          !canScrollPrev ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <img src={arrowLeft} alt="Previous" className="w-8 h-8 md:w-12 md:h-12 object-contain" />
      </button>

      {/* Carousel button — right */}
      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next"
        className={`absolute right-4 md:-right-16 top-40 -translate-y-1/2 z-110 transition-opacity cursor-pointer bg-black/50 md:bg-transparent rounded-full p-1 ${
          !canScrollNext ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <img
          src={arrowRight}
          alt="Next"
          className="w-11 h-11 md:w-12.5 md:h-12.5 lg:w-14 lg:h-14 object-contain"
        />
      </button>
    </>
  );
}

function CarouselBlurOverlay() {
  const { canScrollPrev, canScrollNext } = useCarousel();

  return (
    <>
      {/* Left blur */}
      <div
        className={`absolute left-0 top-0 h-full w-20 z-20 bg-linear-to-r from-black via-black/80 to-transparent pointer-events-none transition-opacity duration-300 ${
          canScrollPrev ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Right blur */}
      <div
        className={`absolute right-0 top-0 h-full w-20 z-20 bg-linear-to-l from-black via-black/80 to-transparent pointer-events-none transition-opacity duration-300 ${
          canScrollNext ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  );
}

export function TrendingSection() {
  const { data, isLoading } = useTrendingMovies();
  const trendingMovies = data?.results || [];

  return (
    <section>
      {/* Header */}
      <div className="flex flex-col gap-3xl md:gap-4xl lg:gap-5xl py-5xl md:pt-none pb-md md:pb-5xl lg:pb-8xl mt-48 md:mt-65 lg:-mt-1.75">
        <h2 className="text-neutral-25 font-bold text-size-display-xs md:text-size-display-md lg:text-size-display-lg">
          Trending Now
        </h2>

        <div className="relative w-full">
          <Carousel opts={{ align: 'start', loop: false }} className="w-full">
            <CustomNav />
            <CarouselBlurOverlay />
            {/* Movie list */}
            <div className="w-full overflow-hidden">
              <CarouselContent className="flex flex-nowrap ml-0">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <CarouselItem key={i} className="pl-4 basis-auto">
                        <div className="w-43.25 md:w-50 lg:w-54 shrink-0">
                          <MovieCardSkeleton />
                        </div>
                      </CarouselItem>
                    ))
                  : trendingMovies.map((movie, i) => (
                      <CarouselItem key={movie.id} className="pl-4 basis-auto">
                        <div className="w-43.25 md:50 lg:w-54 shrink-0">
                          <TrendingCard movie={movie} index={i} rank={i + 1} />
                        </div>
                      </CarouselItem>
                    ))}
              </CarouselContent>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
