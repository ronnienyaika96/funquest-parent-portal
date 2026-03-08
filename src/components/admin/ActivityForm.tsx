import { useState, useEffect } from 'react';
import { Activity, CreateActivityInput } from '@/hooks/useActivities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { StepEditor, StepFormData } from './StepEditor';
import { Loader2 } from 'lucide-react';

interface ActivityFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateActivityInput) => Promise<any>;
  onUpdate?: (id: string, data: Partial<CreateActivityInput>) => Promise<boolean>;
  onUpload: (file: File) => Promise<string | null>;
  onSaveSteps?: (activityId: string, steps: StepFormData[]) => Promise<void>;
  editingActivity?: Activity | null;
}

const TYPES = ['letter', 'number', 'word', 'story', 'shape', 'color', 'other'];

export function ActivityForm({
  open,
  onClose,
  onSubmit,
  onUpdate,
  onUpload,
  onSaveSteps,
  editingActivity,
}: ActivityFormProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('letter');
  const [value, setValue] = useState('');
  const [ageMin, setAgeMin] = useState<string>('');
  const [ageMax, setAgeMax] = useState<string>('');
  const [isPublished, setIsPublished] = useState(false);
  const [steps, setSteps] = useState<StepFormData[]>([]);

  useEffect(() => {
    if (open && editingActivity) {
      setTitle(editingActivity.title);
      setType(editingActivity.type);
      setValue(editingActivity.value || '');
      setAgeMin(editingActivity.age_min != null ? String(editingActivity.age_min) : '');
      setAgeMax(editingActivity.age_max != null ? String(editingActivity.age_max) : '');
      setIsPublished(editingActivity.is_published);
      setSteps(
        editingActivity.steps.map((s) => ({
          id: s.id,
          game_type: s.game_type,
          data: s.data as Record<string, any>,
          instruction_audio_url: s.instruction_audio_url,
          step_order: s.step_order,
        }))
      );
    } else if (open) {
      setTitle('');
      setType('letter');
      setValue('');
      setAgeMin('');
      setAgeMax('');
      setIsPublished(false);
      setSteps([]);
    }
  }, [open, editingActivity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data: CreateActivityInput = {
      title,
      type,
      value: value || undefined,
      age_min: ageMin ? parseInt(ageMin) : null,
      age_max: ageMax ? parseInt(ageMax) : null,
      is_published: isPublished,
    };

    try {
      if (editingActivity && onUpdate) {
        await onUpdate(editingActivity.id, data);
        if (onSaveSteps) await onSaveSteps(editingActivity.id, steps);
      } else {
        const result = await onSubmit(data);
        if (result && onSaveSteps) await onSaveSteps(result.id, steps);
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
          <DialogTitle>{editingActivity ? 'Edit Activity' : 'Create New Activity'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Learn Letter A"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g., A, 1, Cat"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ageMin">Age Min</Label>
              <Input
                id="ageMin"
                type="number"
                min={1}
                max={12}
                value={ageMin}
                onChange={(e) => setAgeMin(e.target.value)}
                placeholder="2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ageMax">Age Max</Label>
              <Input
                id="ageMax"
                type="number"
                min={1}
                max={12}
                value={ageMax}
                onChange={(e) => setAgeMax(e.target.value)}
                placeholder="6"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <Label htmlFor="publish">Publish Activity</Label>
              <p className="text-sm text-muted-foreground">Make visible to users</p>
            </div>
            <Switch id="publish" checked={isPublished} onCheckedChange={setIsPublished} />
          </div>

          {/* Steps Editor */}
          <StepEditor steps={steps} onChange={setSteps} onUpload={onUpload} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !title}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingActivity ? 'Save Changes' : 'Create Activity'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
