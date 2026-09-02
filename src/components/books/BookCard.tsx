import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSignedBookUrl } from '@/lib/bookStorage';
import type { Book } from '@/hooks/useBooks';

interface BookCardProps {
  book: Book;
  percent?: number;
  currentPage?: number;
  index?: number;
  onOpen: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, percent = 0, currentPage, index = 0, onOpen }) => {
  const [cover, setCover] = useState<string | null>(null);
  const [coverFailed, setCoverFailed] = useState(false);

  useEffect(() => {
    let active = true;
    getSignedBookUrl(book.cover_url).then((url) => active && setCover(url));
    return () => {
      active = false;
    };
  }, [book.cover_url]);

  const started = percent > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.4), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card rounded-3xl p-3 shadow-medium border border-border/40 flex gap-3 items-stretch"
    >
      <div className="w-24 sm:w-28 shrink-0 rounded-2xl overflow-hidden bg-muted flex items-center justify-center aspect-[3/4]">
        {cover && !coverFailed ? (
          <img
            src={cover}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <BookOpen className="w-8 h-8 text-muted-foreground" aria-hidden />
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          <h3 className="font-extrabold text-foreground text-base sm:text-lg leading-tight line-clamp-2">
            {book.title}
          </h3>
          {book.author && <p className="text-xs text-muted-foreground truncate">by {book.author}</p>}
          <p className="text-xs text-muted-foreground mt-0.5">
            Ages {book.age_min ?? 3}–{book.age_max ?? 8} · {book.page_count} pages
          </p>
        </div>

        <div className="mt-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-funquest-purple transition-all"
                style={{ width: `${Math.min(100, Math.round(percent))}%` }}
              />
            </div>
            <span className="text-xs font-bold text-muted-foreground">{Math.round(percent)}%</span>
          </div>
          <Button
            onClick={onOpen}
            className="w-full rounded-full font-bold min-h-[44px]"
            aria-label={started ? `Continue reading ${book.title}` : `Read ${book.title}`}
          >
            <Play className="w-4 h-4 mr-1" />
            {started ? (currentPage ? `Continue from page ${currentPage}` : 'Continue Reading') : 'Read'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
