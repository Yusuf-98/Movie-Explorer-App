import { useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ToastProps } from '@/types/movie';
import CheckIcon from '../../assets/icons/check.png';

export function Toast({ message, visible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed top-28.5 left-1/2 -translate-x-1/2 z-25 w-[calc(100%-2rem)] max-w-132.75 h-13 flex items-center gap-lg px-3xl rounded-2xl bg-base-white/25 backdrop-blur-2xl"
        >
          {/* Icon */}
          <img src={CheckIcon} className="w-6 h-6 shrink-0" />

          {/* Message */}
          <span className="text-base-white text-md font-medium flex-1">{message}</span>

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center text-white/40 hover:text-white transition-colors ml-auto"
          >
            <X size={16} />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}
