import React, { useState } from 'react';
import { BookOpen, Eye, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAdminBooks, type Book } from '@/hooks/useBooks';
import { getSignedBookUrl } from '@/lib/bookStorage';
import BookUploader from './BookUploader';
import BookProcessor from './BookProcessor';

const statusBadge = (status: string) => {
  if (status === 'ready') return <Badge className="bg-green-600 hover:bg-green-600">Ready</Badge>;
  if (status === 'error') return <Badge variant="destructive">Error</Badge>;
  return <Badge className="bg-amber-500 hover:bg-amber-500">Processing</Badge>;
};

const BookLibraryManager: React.FC = () => {
  const { books, loading, error, progress, createBook, retryProcessing, togglePublish, deleteBook } = useAdminBooks();
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
  const [previewing, setPreviewing] = useState<string | null>(null);
  const { toast } = useToast();

  const preview = async (book: Book) => {
    setPreviewing(book.id);
    const url = await getSignedBookUrl(book.pdf_path, 300);
    setPreviewing(null);
    if (!url) {
      toast({ title: 'Preview unavailable', description: 'The PDF file could not be found.', variant: 'destructive' });
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleToggle = async (book: Book) => {
    try {
      await togglePublish(book);
    } catch (err: any) {
      toast({ title: 'Cannot publish', description: err?.message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBook(deleteTarget.id);
      toast({ title: 'Deleted', description: `"${deleteTarget.title}" was removed.` });
    } catch (err: any) {
      toast({ title: 'Delete failed', description: err?.message, variant: 'destructive' });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <BookUploader progress={progress} onCreate={createBook} />

      <div>
        <h2 className="text-xl font-semibold mb-3">Book Library</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <Card className="bg-white">
            <CardContent className="py-8 text-center text-sm text-destructive">{error}</CardContent>
          </Card>
        ) : books.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="flex flex-col items-center py-12 text-muted-foreground">
              <BookOpen className="h-10 w-10 mb-2 opacity-40" />
              <p className="text-sm">No books uploaded yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {books.map((book) => (
              <Card key={book.id} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold truncate">{book.title}</h3>
                        {statusBadge(book.status)}
                        {book.published && <Badge variant="secondary">Published</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {book.author || 'Unknown author'} · Ages {book.age_min}–{book.age_max} · {book.language} ·{' '}
                        {book.page_count} pages
                      </p>
                      {book.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{book.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 mr-2">
                        <span className="text-xs text-muted-foreground">Publish</span>
                        <Switch
                          checked={book.published}
                          onCheckedChange={() => handleToggle(book)}
                          disabled={book.status !== 'ready' && !book.published}
                          aria-label={`Publish ${book.title}`}
                        />
                      </div>
                      <Button variant="outline" size="sm" onClick={() => preview(book)} disabled={!book.pdf_path}>
                        {previewing === book.id ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                        ) : (
                          <Eye className="h-3.5 w-3.5 mr-1" />
                        )}
                        Preview
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(book)}
                        aria-label={`Delete ${book.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {book.status === 'error' && <BookProcessor book={book} onRetry={retryProcessing} />}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete book?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes <strong>{deleteTarget?.title}</strong>, its pages, and its files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookLibraryManager;
