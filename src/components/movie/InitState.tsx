import { m } from 'framer-motion';

export function InitState() {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center flex-1 gap-xl py-9xl"
    >
      <span className="text-7xl opacity-15">🔍</span>
      <p className="text-neutral-600 text-size-sm">Search for a movie to get started</p>
    </m.div>
  );
}
