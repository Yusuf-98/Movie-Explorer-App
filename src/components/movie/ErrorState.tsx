import ArrowLeft from '../../assets/icons/arrow-left.png';
import Clip from '../../assets/icons/clip.png';

interface DetailErrorProps {
  notFound: boolean;
  onBack: () => void;
  onRetry: () => void;
}

export function DetailError({ notFound, onBack, onRetry }: DetailErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6xl">
      {/* Icon */}
      <img src={Clip} alt="Clip Icon" className="w-50 h-50" />

      {/* Message */}
      <p className="text-base-white text-size-xl font-semibold">
        {notFound ? 'Movie not found' : "Couldn't load this movie"}
      </p>

      {/* Retry button */}
      {!notFound && (
        <button
          onClick={onRetry}
          className="text-base-white text-size-sm font-semibold bg-transparent border border-neutral-800 rounded-full px-3xl py-md hover:border-neutral-500 transition-colors cursor-pointer"
        >
          Try again
        </button>
      )}

      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-md text-neutral-500 hover:text-base-white transition-colors text-size-sm bg-transparent border-none cursor-pointer"
      >
        <img src={ArrowLeft} alt="" aria-hidden="true" className="w-4 h-4" />
        Back to home
      </button>
    </div>
  );
}
