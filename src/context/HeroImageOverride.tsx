import { createContext, useContext } from 'react';

export interface HeroImageOverride {
  movieId: number;
  mobileSrc: string;
  desktopSrc: string;
}

const HeroImageOverrideContext = createContext<HeroImageOverride | null>(null);

export const HeroImageOverrideProvider = HeroImageOverrideContext.Provider;

export function useHeroImageOverride() {
  return useContext(HeroImageOverrideContext);
}
