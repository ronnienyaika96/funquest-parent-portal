import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameShell from '@/components/games/GameShell';
import ChildSelectGate from '@/components/kids/ChildSelectGate';
import BookLibrary from '@/components/books/BookLibrary';
import { usePublishedBooks } from '@/hooks/useBooks';
import { useChildReadingProgress } from '@/hooks/useReadingProgress';
import { useAuth } from '@/hooks/useAuth';
import { useChildProfiles } from '@/hooks/useChildProfiles';

const StoryLibraryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const childId = searchParams.get('childId');
  const { user, loading: authLoading } = useAuth();
  const { children: childProfiles, isLoading: childrenLoading } = useChildProfiles();
  const { books, loading, error, reload } = usePublishedBooks();
  const { progressMap } = useChildReadingProgress(childId);

  useEffect(() => {
    document.title = 'Read & Listen — Choose a Story | FunQuest';
  }, []);

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
        onCancel={() => navigate('/activities')}
        onAddChild={() => navigate('/parent')}
      />
    );
  }

  return (
    <GameShell>
      <header className="flex items-center gap-3 px-4 sm:px-6 pt-4">
        <Button
          variant="secondary"
          onClick={() => navigate('/activities')}
          className="rounded-full min-w-[48px] min-h-[48px] p-0"
          aria-label="Back to activities"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground drop-shadow-sm">Choose a Story</h1>
          <p className="text-sm font-semibold text-foreground/70">Read and listen to amazing stories!</p>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-6 pb-24 max-w-4xl mx-auto w-full">
        <BookLibrary
          books={books}
          loading={loading}
          error={error}
          progressMap={progressMap}
          onOpen={(bookId) => navigate(`/read/${bookId}?childId=${childId}`)}
          onRetry={reload}
        />
      </main>
    </GameShell>
  );
};

export default StoryLibraryPage;
