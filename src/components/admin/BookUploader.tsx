import React, { useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import type { BookMeta, ProcessProgress } from '@/hooks/useBooks';

interface BookUploaderProps {
  progress: ProcessProgress;
  onCreate: (meta: BookMeta, pdf: File, cover: File | null, useOcr: boolean) => Promise<string>;
}

const MAX_PDF_MB = 50;

const BookUploader: React.FC<BookUploaderProps> = ({ progress, onCreate }) => {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [pdf, setPdf] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [useOcr, setUseOcr] = useState(true);
  const [meta, setMeta] = useState<BookMeta>({
    title: '',
    author: '',
    description: '',
    age_min: 4,
    age_max: 8,
    language: 'English',
  });

  const reset = () => {
    setPdf(null);
    setCover(null);
    setMeta({ title: '', author: '', description: '', age_min: 4, age_max: 8, language: 'English' });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meta.title.trim()) {
      toast({ title: 'Title required', description: 'Give the book a title.', variant: 'destructive' });
      return;
    }
    if (!pdf) {
      toast({ title: 'PDF required', description: 'Choose a PDF file to upload.', variant: 'destructive' });
      return;
    }
    if (pdf.size > MAX_PDF_MB * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: `PDFs must be under ${MAX_PDF_MB} MB.`,
        variant: 'destructive',
      });
      return;
    }

    setBusy(true);
    try {
      await onCreate(meta, pdf, cover, useOcr);
      toast({ title: 'Book ready', description: `"${meta.title}" was processed successfully.` });
      reset();
    } catch (err: any) {
      toast({
        title: 'Processing failed',
        description: err?.message || 'The book was saved with status Error. You can retry processing below.',
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  const pct = progress && progress.total ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Upload a Book</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="book-title">Title *</Label>
            <Input
              id="book-title"
              value={meta.title}
              onChange={(e) => setMeta({ ...meta, title: e.target.value })}
              placeholder="Kahigi the Hunter"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="book-author">Author</Label>
            <Input
              id="book-author"
              value={meta.author}
              onChange={(e) => setMeta({ ...meta, author: e.target.value })}
              placeholder="FunQuest Stories"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="book-desc">Description</Label>
            <Textarea
              id="book-desc"
              value={meta.description}
              onChange={(e) => setMeta({ ...meta, description: e.target.value })}
              placeholder="A short summary of the story"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="age-min">Age from</Label>
              <Input
                id="age-min"
                type="number"
                min={2}
                max={12}
                value={meta.age_min}
                onChange={(e) => setMeta({ ...meta, age_min: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age-max">Age to</Label>
              <Input
                id="age-max"
                type="number"
                min={2}
                max={12}
                value={meta.age_max}
                onChange={(e) => setMeta({ ...meta, age_max: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lang">Language</Label>
            <Input
              id="lang"
              value={meta.language}
              onChange={(e) => setMeta({ ...meta, language: e.target.value })}
              placeholder="English"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdf">Book PDF *</Label>
            <Input
              id="pdf"
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdf(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Cover image (optional)</Label>
            <Input
              id="cover"
              type="file"
              accept="image/*"
              onChange={(e) => setCover(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">If empty, page 1 becomes the cover.</p>
          </div>

          <div className="md:col-span-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
            <div>
              <p className="text-sm font-medium">Use OCR for image-only pages</p>
              <p className="text-xs text-muted-foreground">Slower, but reads scanned pages.</p>
            </div>
            <Switch checked={useOcr} onCheckedChange={setUseOcr} />
          </div>

          {busy && (
            <div className="md:col-span-2">
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {progress ? `${progress.stage} (${progress.current}/${progress.total})` : 'Preparing…'}
              </p>
            </div>
          )}

          <div className="md:col-span-2">
            <Button type="submit" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              {busy ? 'Processing…' : 'Upload & Process'}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Keep this tab open while the book is processing.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookUploader;
