import { useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import ClipFavorite from '../../assets/icons/clip-favorite.png';
import { Button } from '../ui/button';

export function EmptyFavorites() {
  const navigate = useNavigate();

  return (
    <div className="md:w-75 pt-9 md:pt-14 pb-39 md:pb-60 mx-auto">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center gap-3xl"
      >
        <div className="flex flex-col items-center gap-lg md:gap-xl">
          {/* Icon */}
          <img src={ClipFavorite} alt="Clip Icon" className="w-50 h-50 grayscale-100" />

          {/* Message */}
          <div className="flex flex-col gap-md text-center">
            <p className="text-base-white font-semibold text-size-md">Data Empty</p>
            <p className="text-neutral-400 text-size-sm">You don't have a favorite movie yet</p>
          </div>
        </div>

        <Button
          variant={'default'}
          type="button"
          onClick={() => navigate('/')}
          className="w-50 md:w-full font-semibold text-size-sm"
        >
          Explore Movie
        </Button>
      </m.div>
    </div>
  );
}
