import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import {
  Upload,
  Trash2,
  Copy,
  FileAudio,
  Image,
  Gamepad2,
  Award,
  UserCircle,
  AlertTriangle,
  ExternalLink,
  Loader2,
  FolderOpen,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface StorageFile {
  name: string;
  id: string;
  created_at: string;
  metadata: { size?: number; mimetype?: string } | null;
}

const ALLOWED_BUCKETS = [
  { id: 'audio', label: 'Audio', icon: FileAudio },
  { id: 'thumbnails', label: 'Thumbnails', icon: Image },
  { id: 'game assets', label: 'Game Assets', icon: Gamepad2 },
  { id: 'badges', label: 'Badges', icon: Award },
  { id: 'avatars', label: 'Avatars', icon: UserCircle },
] as const;

const RESTRICTED_BUCKETS = ['child uploads', 'reports', 'admin assets'];

function formatFileSize(bytes?: number) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function AssetsManager() {
  const [activeBucket, setActiveBucket] = useState<string>(ALLOWED_BUCKETS[0].id);
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteFile, setDeleteFile] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from(activeBucket).list('', {
        limit: 200,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (error) throw error;
      setFiles((data || []).filter((f) => f.name !== '.emptyFolderPlaceholder') as StorageFile[]);
    } catch (e: any) {
      console.error('Error listing files:', e);
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [activeBucket, toast]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const ext = file.name.split('.').pop();
        const path = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const { error } = await supabase.storage.from(activeBucket).upload(path, file);
        if (error) throw error;
      }
      toast({ title: 'Uploaded', description: `${fileList.length} file(s) uploaded` });
      await fetchFiles();
    } catch (e: any) {
      toast({ title: 'Upload failed', description: e.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!deleteFile) return;
    try {
      const { error } = await supabase.storage.from(activeBucket).remove([deleteFile]);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'File removed' });
      setDeleteFile(null);
      await fetchFiles();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const copyUrl = (fileName: string) => {
    const { data } = supabase.storage.from(activeBucket).getPublicUrl(fileName);
    navigator.clipboard.writeText(data.publicUrl);
    toast({ title: 'Copied', description: 'Public URL copied to clipboard' });
  };

  const getPreviewUrl = (fileName: string) => {
    const { data } = supabase.storage.from(activeBucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const isImage = (name: string) => /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(name);

  return (
    <div className="space-y-6">
      {/* Warning */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex items-start gap-3 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800 text-sm">Restricted Buckets</p>
            <p className="text-xs text-amber-700 mt-1">
              The following buckets are not manageable from this page: <strong>{RESTRICTED_BUCKETS.join(', ')}</strong>. 
              Manage them directly via the Supabase dashboard if needed.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeBucket} onValueChange={setActiveBucket}>
        <TabsList className="bg-white shadow-sm flex-wrap h-auto gap-1 p-1">
          {ALLOWED_BUCKETS.map((b) => {
            const Icon = b.icon;
            return (
              <TabsTrigger key={b.id} value={b.id} className="gap-1.5 text-xs">
                <Icon className="h-3.5 w-3.5" />
                {b.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {ALLOWED_BUCKETS.map((b) => (
          <TabsContent key={b.id} value={b.id} className="space-y-4 mt-4">
            {/* Upload bar */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{b.label}</h3>
              <label>
                <input type="file" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
                <Button asChild variant="default" size="sm" disabled={uploading}>
                  <span>
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
                    Upload
                  </span>
                </Button>
              </label>
            </div>

            {/* File grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-xl" />
                ))}
              </div>
            ) : files.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="flex flex-col items-center py-12 text-muted-foreground">
                  <FolderOpen className="h-12 w-12 mb-3 opacity-40" />
                  <p className="text-sm">No files in this bucket yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {files.map((file) => (
                  <Card key={file.id || file.name} className="bg-white overflow-hidden group">
                    {/* Preview */}
                    <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                      {isImage(file.name) ? (
                        <img
                          src={getPreviewUrl(file.name)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <FileAudio className="h-10 w-10 text-muted-foreground/40" />
                      )}
                    </div>
                    <CardContent className="p-3 space-y-2">
                      <p className="text-xs font-medium truncate" title={file.name}>{file.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{formatFileSize(file.metadata?.size)}</span>
                        <span>·</span>
                        <span>{formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyUrl(file.name)} title="Copy URL">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild title="Open">
                          <a href={getPreviewUrl(file.name)} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteFile(file.name)} title="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteFile} onOpenChange={() => setDeleteFile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{deleteFile}</strong> from the <strong>{activeBucket}</strong> bucket.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
