import { m, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { TrailerModalProps } from '@/types/movie';
import { useModalA11y } from '@/hooks/useModalA11y';

export function TrailerModal({ videos, visible, onClose, movieTitle }: TrailerModalProps) {
  // --- Find trailer ---
  const trailer =
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ??
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ??
    videos.find((v) => v.site === 'YouTube');

  const containerRef = useModalA11y(visible, onClose);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <m.div
            className="fixed inset-0 z-50 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <m.div
            className="fixed inset-0 z-201 flex items-center justify-center p-6"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25 }}
          >
            <div
              ref={containerRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${movieTitle} trailer`}
              tabIndex={-1}
              className="relative w-full bg-neutral-900 overflow-hidden outline-none"
              style={{
                maxWidth: '900px',
                borderRadius: '16px',
                border: '1px solid #252B37',
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X size={16} />
              </button>

              {/* Title bar */}
              <div className="px-6 py-4 border-b border-white/10">
                <h3 className="text-white font-semibold text-sm truncate pr-8">{movieTitle}</h3>
              </div>

              {/* Video or fallback */}
              {trailer ? (
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                    title={`${movieTitle} Trailer`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 'none' }}
                  />
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center text-white/40 gap-4"
                  style={{ height: '400px' }}
                >
                  <span className="text-5xl">🎬</span>
                  <p className="text-base font-medium">No trailer available</p>
                  <p className="text-sm text-white/30">Check back later for updates</p>
                </div>
              )}
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
