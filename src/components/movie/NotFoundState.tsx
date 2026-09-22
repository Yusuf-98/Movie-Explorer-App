import { m } from 'framer-motion';
import NotFound from '../../assets/icons/clip.png';

export function NotFoundState() {
  return (
    <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col items-center justify-center flex-1 gap-xl pb-68 mt-38 md:mt-55.25">
        {/* Icon */}
        <div className="w-50 h-50">
          <img src={NotFound} alt="Not Found" className="w-full h-full grayscale-100" />
        </div>

        {/* Message */}
        <div className="flex flex-col items-center gap-md text-center">
          <p className="text-base-white font-semibold text-size-md">Data Not Found</p>
          <p className="text-neutral-400 text-size-sm">Try other keywords</p>
        </div>
      </div>
    </m.div>
  );
}
