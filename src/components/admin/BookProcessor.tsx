import React, { useRef, useState } from 'react';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Book } from '@/hooks/useBooks';

interface BookProcessorProps {
  book: Book;
  onRetry: (book: Book, pdf: File, useOcr: boolean) => Promise<void>;
}

/** Shows a failed book's error and lets an admin re-run processing with a fresh PDF. */
const BookProcessor: React.FC<BookProcessorProps> = ({ book, onRetry }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      await onRetry(book, file, true);
      toast({ title: 'Processed', description: `"${book.title}" is ready.` });
    } catch (err: any) {
      toast({
        title: 'Still failing',
        description: err?.message || 'Processing failed again.',
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-3 mt-2">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">Processing failed</p>
          <p className="text-xs text-red-700 mt-0.5 break-words">
            {book.error_message || 'The PDF could not be processed.'}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5 mr-1" />}
            Retry Processing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookProcessor;
