import { m } from 'framer-motion';
import { getImageUrl } from '@/lib/utils';
import { IMAGE_SIZES } from '@/lib/constants';
import type { Cast } from '@/types/movie';

function CastCard({ member, index }: { member: Cast; index: number }) {
  const profileUrl = getImageUrl(member.profile_path, IMAGE_SIZES.profile.medium);

  return (
    <m.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="flex flex-row items-center gap-lg md:gap-xl"
    >
      {/* Profile image */}
      <div className="w-13.75 md:w-17.25 h-21 md:h-26 shrink-0 overflow-hidden rounded-lg">
        {member.profile_path ? (
          <img
            src={profileUrl}
            alt={member.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xl">
            👤
          </div>
        )}
      </div>

      {/* Name & character */}
      <div className="flex flex-col min-w-0">
        <p className="text-size-sm md:text-size-md font-semibold text-neutral-25">{member.name}</p>
        <p className="text-size-sm md:text-size-md text-neutral-400">{member.character}</p>
      </div>
    </m.div>
  );
}

export default CastCard;
