import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import BookCard from './BookCard';
import type { Book } from '@/hooks/useBooks';
import type { ReadingProgressRow } from '@/hooks/useReadingProgress';

interface BookLibraryProps {
  books: Book[];
  loading: boolean;
  error: string | null;
  progressMap: Record<string, ReadingProgressRow>;
  onOpen: (bookId: string) => void;
  onRetry: () => void;
}

const BookLibrary: React.FC<BookLibraryProps> = ({ books, loading, error, progressMap, onOpen, onRetry }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-3xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-14 bg-card/90 rounded-3xl shadow-medium">
        <span className="text-5xl block mb-3">📶</span>
        <h3 className="text-lg font-bold text-foreground mb-1">We couldn’t load the stories</h3>
        <p className="text-muted-foreground text-sm mb-4">Check your connection and try again.</p>
        <button onClick={onRetry} className="rounded-full bg-primary text-primary-foreground font-bold px-6 py-3">
          Try Again
        </button>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-14 bg-card/90 rounded-3xl shadow-medium">
        <span className="text-5xl block mb-3">📚</span>
        <h3 className="text-lg font-bold text-foreground mb-1">No stories yet</h3>
        <p className="text-muted-foreground text-sm">New books are coming soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {books.map((book, i) => {
        const p = progressMap[book.id];
        const percent = p && book.page_count > 0 ? (p.pages_completed / book.page_count) * 100 : 0;
        return (
          <BookCard
            key={book.id}
            book={book}
            index={i}
            percent={percent}
            currentPage={p && !p.completed && p.current_page > 1 ? p.current_page : undefined}
            onOpen={() => onOpen(book.id)}
          />
        );
      })}
    </div>
  );
};

export default BookLibrary;
