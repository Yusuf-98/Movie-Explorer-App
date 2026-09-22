import ArrowLeft from '../../assets/icons/arrow-left.png';
import Clip from '../../assets/icons/clip.png';

export function DetailError({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6xl">
      {/* Icon */}
      <img src={Clip} alt="Clip Icon" className="w-50 h-50" />

      {/* Message */}
      <p className="text-base-white text-size-xl font-semibold">Movie not found</p>

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
