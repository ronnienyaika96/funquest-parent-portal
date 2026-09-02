import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import GameShell from '@/components/games/GameShell';
import ChildSelectGate from '@/components/kids/ChildSelectGate';
import StoryPage from '@/components/books/StoryPage';
import NarrationControls from '@/components/books/NarrationControls';
import ReadingProgress from '@/components/books/ReadingProgress';
import { useAuth } from '@/hooks/useAuth';
import { useChildProfiles } from '@/hooks/useChildProfiles';
import { useNarration } from '@/hooks/useNarration';
import { useBookReadingProgress } from '@/hooks/useReadingProgress';
import type { Book, BookPage } from '@/hooks/useBooks';

const StoryReaderPage = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const childId = searchParams.get('childId');
  const { user, loading: authLoading } = useAuth();
  const { children: childProfiles, isLoading: childrenLoading } = useChildProfiles();

  const [book, setBook] = useState<Book | null>(null);
  const [pages, setPages] = useState<BookPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [textSize, setTextSize] = useState(20);
  const [autoTurn, setAutoTurn] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [restoredFrom, setRestoredFrom] = useState<number | null>(null);
  const restoredRef = useRef(false);
  const interactingRef = useRef(false);
  const autoTurnTimer = useRef<number | null>(null);

  const { progress, save } = useBookReadingProgress(childId, bookId);

  const load = useCallback(async () => {
    if (!bookId) return;
    setLoading(true);
    setLoadError(null);
    const [bookRes, pagesRes] = await Promise.all([
      supabase.from('books').select('*').eq('id', bookId).maybeSingle(),
      supabase.from('book_pages').select('*').eq('book_id', bookId).order('page_number', { ascending: true }),
    ]);
    if (bookRes.error || !bookRes.data) {
      setLoadError('We couldn’t open this story.');
      setLoading(false);
      return;
    }
    if (pagesRes.error) {
      setLoadError('We couldn’t load the story pages.');
      setLoading(false);
      return;
    }
    setBook(bookRes.data as Book);
    setPages((pagesRes.data || []) as BookPage[]);
    setLoading(false);
  }, [bookId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (book) document.title = `${book.title} — Read & Listen | FunQuest`;
  }, [book]);

  // Restore reading position once
  useEffect(() => {
    if (restoredRef.current || !progress || pages.length === 0) return;
    restoredRef.current = true;
    if (progress.current_page > 1 && !progress.completed) {
      const idx = Math.min(progress.current_page - 1, pages.length - 1);
      setPageIndex(idx);
      setRestoredFrom(progress.current_page);
      window.setTimeout(() => setRestoredFrom(null), 4000);
    }
  }, [progress, pages]);

  const currentPage = pages[pageIndex] || null;
  const pageText = currentPage?.extracted_text?.trim() || '';
  const totalPages = pages.length || book?.page_count || 0;
  const isLast = pageIndex >= pages.length - 1;

  const handleNarrationEnd = useCallback(() => {
    if (!autoTurn || interactingRef.current) return;
    if (isLast) return;
    autoTurnTimer.current = window.setTimeout(() => {
      setPageIndex((i) => Math.min(i + 1, pages.length - 1));
    }, 1500);
  }, [autoTurn, isLast, pages.length]);

  const narration = useNarration(pageText, handleNarrationEnd);
  const { stop: stopNarration, speak } = narration;

  // Stop narration on page change / unmount — never let old audio bleed over.
  useEffect(() => {
    stopNarration();
    return () => stopNarration();
  }, [pageIndex, stopNarration]);

  // Auto-start narration on the new page while auto page turn is on
  const autoTurnRef = useRef(autoTurn);
  autoTurnRef.current = autoTurn;
  useEffect(() => {
    if (!autoTurnRef.current || !pageText) return;
    const t = window.setTimeout(() => speak(), 400);
    return () => window.clearTimeout(t);
  }, [pageIndex, pageText, speak]);

  useEffect(() => {
    return () => {
      if (autoTurnTimer.current) window.clearTimeout(autoTurnTimer.current);
    };
  }, []);

  const markInteracting = () => {
    interactingRef.current = true;
    if (autoTurnTimer.current) window.clearTimeout(autoTurnTimer.current);
    window.setTimeout(() => (interactingRef.current = false), 1200);
  };

  // Persist progress
  useEffect(() => {
    if (!childId || !bookId || pages.length === 0) return;
    save({
      current_page: pageIndex + 1,
      pages_completed: pageIndex + 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pages.length, childId, bookId]);

  const goPrev = () => {
    markInteracting();
    setPageIndex((i) => Math.max(0, i - 1));
  };

  const goNext = () => {
    markInteracting();
    if (isLast) {
      finishBook();
      return;
    }
    setPageIndex((i) => Math.min(pages.length - 1, i + 1));
  };

  const finishBook = async () => {
    stopNarration();
    setCelebrate(true);
    await save({
      current_page: pages.length,
      pages_completed: pages.length,
      completed: true,
      stars_earned: 3,
    });
  };

  // Auto page turn on the last page completes the book
  useEffect(() => {
    if (autoTurn && isLast && !narration.speaking && progress && progress.current_page === pages.length) {
      // handled manually by the child pressing next; no silent completion
    }
  }, [autoTurn, isLast, narration.speaking, progress, pages.length]);

  // Swipe navigation (mobile)
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touchStart.current = e.changedTouches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(dx) < 60) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  const libraryUrl = useMemo(() => `/read${childId ? `?childId=${childId}` : ''}`, [childId]);

  if (authLoading || childrenLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace state={{ from: location.pathname + location.search }} />;

  if (!childId) {
    return (
      <ChildSelectGate
        children={(childProfiles || []).map((c) => ({ id: c.id, name: c.name, age: c.age, avatar: c.avatar }))}
        onSelect={(id) => setSearchParams({ childId: id }, { replace: true })}
        onCancel={() => navigate('/read')}
        onAddChild={() => navigate('/parent')}
      />
    );
  }

  if (loading) {
    return (
      <GameShell>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </GameShell>
    );
  }

  if (loadError || !book || pages.length === 0) {
    return (
      <GameShell>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-card/95 rounded-3xl shadow-strong p-8 text-center max-w-md">
            <span className="text-5xl block mb-3">😕</span>
            <h1 className="text-xl font-extrabold text-foreground mb-1">Story unavailable</h1>
            <p className="text-muted-foreground text-sm mb-5">
              {loadError || 'This story has no pages yet. Please try another one.'}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={load} className="rounded-full font-bold min-h-[48px]">
                <RefreshCw className="w-4 h-4 mr-2" /> Try Again
              </Button>
              <Button variant="secondary" onClick={() => navigate(libraryUrl)} className="rounded-full font-bold min-h-[48px]">
                Back to Stories
              </Button>
            </div>
          </div>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell>
      <header className="flex items-center gap-3 px-3 sm:px-6 pt-4">
        <Button
          variant="secondary"
          onClick={() => {
            stopNarration();
            navigate(libraryUrl);
          }}
          className="rounded-full min-w-[56px] min-h-[56px] p-0"
          aria-label="Back to stories"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="flex-1 text-center text-lg sm:text-2xl font-extrabold text-foreground drop-shadow-sm truncate">
          {book.title}
        </h1>
        <div className="hidden sm:block w-[56px]" />
      </header>

      <div className="px-3 sm:px-6 mt-3 flex justify-center">
        <ReadingProgress
          currentPage={pageIndex + 1}
          totalPages={totalPages}
          stars={progress?.stars_earned ?? 0}
        />
      </div>

      {restoredFrom && (
        <p className="text-center text-sm font-bold text-foreground/80 mt-2">
          Continuing from page {restoredFrom} 📖
        </p>
      )}

      <main
        className="flex-1 px-3 sm:px-6 py-4 max-w-6xl w-full mx-auto"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <StoryPage
          page={currentPage}
          textSize={textSize}
          charIndex={narration.charIndex}
          charLength={narration.charLength}
          speaking={narration.speaking}
        />
        {currentPage?.needs_ocr && !pageText && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            We couldn’t read the words on this page aloud.
          </p>
        )}
      </main>

      <div className="sticky bottom-0 px-3 sm:px-6 pb-4 pt-2 max-w-6xl w-full mx-auto">
        <NarrationControls
          supported={narration.supported}
          speaking={narration.speaking}
          paused={narration.paused}
          muted={narration.muted}
          rate={narration.rate}
          volume={narration.volume}
          voices={narration.voices}
          voiceURI={narration.voiceURI}
          autoTurn={autoTurn}
          canPrev={pageIndex > 0}
          canNext={true}
          hasText={!!pageText}
          textSize={textSize}
          onToggle={() => {
            markInteracting();
            narration.toggle();
          }}
          onRestart={() => {
            markInteracting();
            narration.restart();
          }}
          onPrev={goPrev}
          onNext={goNext}
          onAutoTurn={setAutoTurn}
          onMuted={narration.setMuted}
          onRate={narration.setRate}
          onVolume={narration.setVolume}
          onVoice={narration.setVoiceURI}
          onTextSize={setTextSize}
        />
      </div>

      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-card rounded-3xl shadow-strong p-8 text-center max-w-sm w-full"
            >
              <span className="text-6xl block mb-3">🎉</span>
              <h2 className="text-2xl font-extrabold text-foreground mb-1">Story Complete!</h2>
              <p className="text-muted-foreground mb-4">You earned 3 stars ⭐⭐⭐</p>
              <div className="flex flex-col gap-3">
                <Button
                  className="rounded-full font-bold min-h-[56px]"
                  onClick={() => {
                    setCelebrate(false);
                    setPageIndex(0);
                  }}
                >
                  Read Again
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full font-bold min-h-[56px]"
                  onClick={() => navigate(libraryUrl)}
                >
                  Back to Stories
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
};

export default StoryReaderPage;
