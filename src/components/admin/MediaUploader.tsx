import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Image, Music, FileCode, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaUploaderProps {
  label: string;
  accept: string;
  value: string[];
  onChange: (urls: string[]) => void;
  onUpload: (file: File) => Promise<string | null>;
  multiple?: boolean;
  className?: string;
}

export function MediaUploader({
  label,
  accept,
  value,
  onChange,
  onUpload,
  multiple = false,
  className,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const url = await onUpload(file);
      if (url) {
        newUrls.push(url);
      }
    }

    if (multiple) {
      onChange([...value, ...newUrls]);
    } else {
      onChange(newUrls.slice(0, 1));
    }

    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeUrl = (urlToRemove: string) => {
    onChange(value.filter(url => url !== urlToRemove));
  };

  const getFileIcon = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    if (['svg'].includes(ext || '')) return <FileCode className="h-5 w-5" />;
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext || '')) return <Music className="h-5 w-5" />;
    return <Image className="h-5 w-5" />;
  };

  const isImage = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
  };

  return (
    <div className={className}>
      <label className="text-sm font-medium mb-2 block">{label}</label>
      
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-6 transition-colors cursor-pointer",
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        
        <div className="flex flex-col items-center gap-2 text-center">
          {uploading ? (
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {uploading ? 'Uploading...' : 'Click or drag files to upload'}
          </p>
          <p className="text-xs text-muted-foreground">
            {accept.replace(/\./g, '').replace(/,/g, ', ').toUpperCase()}
          </p>
        </div>
      </div>

      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {value.map((url, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <CardContent className="p-2">
                {isImage(url) ? (
                  <img 
                    src={url} 
                    alt={`Upload ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-20 rounded-lg bg-muted flex items-center justify-center">
                    {getFileIcon(url)}
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); removeUrl(url); }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

interface SingleMediaUploaderProps {
  label: string;
  accept: string;
  value: string | null;
  onChange: (url: string | null) => void;
  onUpload: (file: File) => Promise<string | null>;
  className?: string;
}

export function SingleMediaUploader({
  label,
  accept,
  value,
  onChange,
  onUpload,
  className,
}: SingleMediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const url = await onUpload(files[0]);
    onChange(url);
    setUploading(false);
  };

  const isImage = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
  };

  return (
    <div className={className}>
      <label className="text-sm font-medium mb-2 block">{label}</label>
      
      {value ? (
        <Card className="relative group overflow-hidden">
          <CardContent className="p-3">
            {isImage(value) ? (
              <img 
                src={value} 
                alt="Thumbnail"
                className="w-full h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-32 rounded-lg bg-muted flex items-center justify-center">
                <Music className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onChange(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className="border-2 border-dashed rounded-xl p-6 transition-colors cursor-pointer border-muted-foreground/25 hover:border-primary/50"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          
          <div className="flex flex-col items-center gap-2 text-center">
            {uploading ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
            <p className="text-sm text-muted-foreground">
              {uploading ? 'Uploading...' : 'Click to upload'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
