import { m } from 'framer-motion';
import type { MovieOverviewProps } from '@/types/movie';

export function MovieOverview({ movie }: MovieOverviewProps) {
  return (
    <m.section
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-6xl"
    >
      <h2 className="text-neutral-25 font-bold md:text-size-display-md md:-tracking-1 mb-2">
        Overview
      </h2>
      <p className="text-neutral-400 text-size-md">{movie.overview || 'No overview available.'}</p>
    </m.section>
  );
}
