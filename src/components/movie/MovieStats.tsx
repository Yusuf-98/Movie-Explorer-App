import { m } from 'framer-motion';
import StarIcon from '../../assets/icons/star-yellow.png';
import VideoIcon from '../../assets/icons/video.png';
import HappyIcon from '../../assets/icons/emoji-happy.png';
import type { MovieStatsProps } from '@/types/movie';

export function MovieStats({ movie }: MovieStatsProps) {
  const primaryGenre = movie.genres?.[0]?.name ?? 'N/A';

  const ageLimit = movie.adult ? '17+' : '13';

  const stats = [
    {
      icon: (
        <img src={StarIcon} alt="Rating" className="w-6 md:w-8 h-6 md:h-8 fill-secondary-100" />
      ),
      label: 'Rating',
      value: `${movie.vote_average.toFixed(1)}/10`,
      valueClass: 'text-neutral-300 text-size-xs md:text-size-md',
    },
    {
      icon: <img src={VideoIcon} alt="Genre" className="w-6 md:w-8 h-6 md:h-8 text-neutral-25" />,
      label: 'Genre',
      value: primaryGenre,
      valueClass: 'text-neutral-300 text-size-xs md:text-size-md',
    },
    {
      icon: (
        <img src={HappyIcon} alt="Age Limit" className="w-6 md:w-8 h-6 md:h-8 text-neutral-25" />
      ),
      label: 'Age Limit',
      value: ageLimit,
      valueClass: 'text-neutral-300 text-size-xs md:text-size-md',
    },
  ];

  return (
    <div className="flex flex-row rounded-2xl justify-between gap-lg md:gap-2xl">
      {stats.map((stat, i) => (
        <m.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
          className="flex-1 flex flex-col items-center justify-center gap-md px-xl md:p-2xl border border-neutral-800 bg-base-black"
          style={{
            background: '#181d27',
            borderRadius: '12px',
            padding: '24px 16px',
            border: '1px solid #252B37',
            minHeight: '120px',
          }}
        >
          {stat.icon}
          <span className="text-center text-white/50 text-sm">{stat.label}</span>
          <span className={stat.valueClass}>{stat.value}</span>
        </m.div>
      ))}
    </div>
  );
}
