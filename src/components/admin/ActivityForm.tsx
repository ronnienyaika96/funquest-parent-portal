import { useState, useEffect } from 'react';
import { Activity, ActivityStep, CreateActivityInput } from '@/hooks/useActivities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SingleMediaUploader, MediaUploader } from './MediaUploader';
import { StepEditor } from './StepEditor';
import { Loader2 } from 'lucide-react';

interface ActivityFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateActivityInput) => Promise<any>;
  onUpdate?: (id: string, data: Partial<CreateActivityInput>) => Promise<boolean>;
  onUpload: (file: File) => Promise<string | null>;
  editingActivity?: Activity | null;
}

const CATEGORIES = [
  'letters',
  'numbers',
  'shapes',
  'colors',
  'animals',
  'nature',
  'music',
  'art',
  'puzzle',
  'memory',
  'other',
];

const AGE_RANGES = [
  '2-3',
  '3-4',
  '4-5',
  '5-6',
  '6+',
  'All ages',
];

export function ActivityForm({
  open,
  onClose,
  onSubmit,
  onUpdate,
  onUpload,
  editingActivity,
}: ActivityFormProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('letters');
  const [ageRange, setAgeRange] = useState('3-4');
  const [steps, setSteps] = useState<ActivityStep[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  // Reset form when opening/closing or when editing activity changes
  useEffect(() => {
    if (open && editingActivity) {
      setName(editingActivity.name);
      setDescription(editingActivity.description || '');
      setCategory(editingActivity.category);
      setAgeRange(editingActivity.age_range);
      setSteps(editingActivity.steps);
      setThumbnailUrl(editingActivity.thumbnail_url);
      setImages(editingActivity.images);
      setAudioUrls(editingActivity.audio_urls);
      setIsPublished(editingActivity.status === 'published');
    } else if (open) {
      // Reset form for new activity
      setName('');
      setDescription('');
      setCategory('letters');
      setAgeRange('3-4');
      setSteps([]);
      setThumbnailUrl(null);
      setImages([]);
      setAudioUrls([]);
      setIsPublished(false);
    }
  }, [open, editingActivity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data: CreateActivityInput = {
      name,
      description: description || undefined,
      category,
      age_range: ageRange,
      steps,
      thumbnail_url: thumbnailUrl || undefined,
      images,
      audio_urls: audioUrls,
      status: isPublished ? 'published' : 'draft',
    };

    try {
      if (editingActivity && onUpdate) {
        await onUpdate(editingActivity.id, data);
      } else {
        await onSubmit(data);
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingActivity ? 'Edit Activity' : 'Create New Activity'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Activity Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Learn Letter A"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ageRange">Age Range *</Label>
              <Select value={ageRange} onValueChange={setAgeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AGE_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range} years
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label htmlFor="publish">Publish Activity</Label>
                <p className="text-sm text-muted-foreground">
                  Make visible to users
                </p>
              </div>
              <Switch
                id="publish"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this activity teaches..."
              rows={3}
            />
          </div>

          {/* Thumbnail */}
          <SingleMediaUploader
            label="Thumbnail Image"
            accept=".jpg,.jpeg,.png,.gif,.webp"
            value={thumbnailUrl}
            onChange={setThumbnailUrl}
            onUpload={onUpload}
          />

          {/* Additional Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MediaUploader
              label="Activity Images & SVGs"
              accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
              value={images}
              onChange={setImages}
              onUpload={onUpload}
              multiple
            />

            <MediaUploader
              label="Audio Files"
              accept=".mp3,.wav,.ogg,.m4a"
              value={audioUrls}
              onChange={setAudioUrls}
              onUpload={onUpload}
              multiple
            />
          </div>

          {/* Steps Editor */}
          <StepEditor
            steps={steps}
            onChange={setSteps}
            onUpload={onUpload}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingActivity ? 'Save Changes' : 'Create Activity'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
