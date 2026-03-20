import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GameCard from './GameCard';

interface Game {
  id: string;
  title: string;
  emoji: string;
  color: string;
  progress?: number;
  isNew?: boolean;
}

interface GameCarouselProps {
  title: string;
  titleEmoji: string;
  games: Game[];
  onGameClick?: (gameId: string) => void;
}

const GameCarousel = ({ title, titleEmoji, games, onGameClick }: GameCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -280 : 280,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mb-8">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 mb-4 px-4 sm:px-6"
      >
        <span className="text-3xl">{titleEmoji}</span>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
      </motion.div>

      {/* Carousel */}
      <div className="relative group">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full shadow-medium flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card border border-border/50"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto px-4 sm:px-6 py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <GameCard
                title={game.title}
                emoji={game.emoji}
                color={game.color}
                progress={game.progress}
                isNew={game.isNew}
                onClick={() => onGameClick?.(game.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full shadow-medium flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card border border-border/50"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  );
};

export default GameCarousel;
