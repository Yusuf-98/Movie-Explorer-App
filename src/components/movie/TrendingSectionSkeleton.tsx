import { MovieCardSkeleton } from './MovieCardSkeleton';

export function TrendingSectionSkeleton() {
  return (
    <section>
      {/* Header */}
      <div className="flex flex-col gap-3xl md:gap-4xl lg:gap-5xl py-5xl md:pt-none pb-md md:pb-5xl lg:pb-8xl mt-48 md:mt-65 lg:-mt-1.75">
        <h2 className="text-neutral-25 font-bold text-size-display-xs md:text-size-display-md lg:text-size-display-lg">
          Trending Now
        </h2>

        {/* Movie list */}
        <div className="flex gap-4 overflow-hidden pl-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-43.25 md:w-50 lg:w-54 shrink-0">
              <MovieCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
