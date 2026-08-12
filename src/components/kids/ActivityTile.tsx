import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Star } from 'lucide-react';

interface ActivityTileProps {
  title: string;
  subtitle?: string;
  emoji: string;
  color: string; // tailwind gradient classes e.g. "from-x to-y"
  accent: string; // tailwind bg class for the arrow button
  progress?: number;
  isNew?: boolean;
  thumbnail?: string;
  index?: number;
  onClick?: () => void;
}

const ActivityTile = ({
  title,
  subtitle,
  emoji,
  color,
  accent,
  progress,
  isNew,
  thumbnail,
  index = 0,
  onClick,
}: ActivityTileProps) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.4), duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="w-full text-left bg-card rounded-3xl p-3 shadow-medium border border-border/40 flex flex-col gap-3"
    >
      {/* Artwork */}
      <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br ${color}`}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl drop-shadow-lg select-none">
            {emoji}
          </span>
        )}

        {isNew && (
          <span className="absolute top-2 right-2 bg-funquest-warning text-foreground text-[10px] font-extrabold px-2 py-1 rounded-full shadow-soft flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            NEW
          </span>
        )}

        {progress !== undefined && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-card rounded-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Label row */}
      <div className="flex items-center gap-2 px-1 pb-1">
        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground text-sm sm:text-base leading-tight line-clamp-2">{title}</p>
          {subtitle && (
            <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <span className={`flex-shrink-0 w-9 h-9 rounded-full ${accent} flex items-center justify-center shadow-soft`}>
          <ChevronRight className="w-5 h-5 text-primary-foreground" />
        </span>
      </div>
    </motion.button>
  );
};

export default ActivityTile;
