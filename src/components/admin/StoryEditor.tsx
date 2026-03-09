import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useActivities, Activity, CreateActivityInput } from '@/hooks/useActivities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Plus,
  Trash2,
  Edit,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Loader2,
  BookOpen,
  Upload,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const PAGE_TYPES = [
  { value: 'story', label: 'Story Page' },
  { value: 'tap_object', label: 'Tap Object' },
  { value: 'question', label: 'Question' },
  { value: 'ending', label: 'Ending' },
];

interface StoryStepData {
  mode: 'story_interactive';
  page_type: string;
  page_title: string;
  instruction: string;
  story_text: string;
  illustration: string;
  narration_audio: string;
  show_next: boolean;
  // question fields
  choices: { label: string; image: string; correct: boolean }[];
  // hotspot fields
  hotspots: { id: string; x: number; y: number; width: number; height: number; label: string; correct: boolean }[];
}

const emptyStepData = (): StoryStepData => ({
  mode: 'story_interactive',
  page_type: 'story',
  page_title: '',
  instruction: '',
  story_text: '',
  illustration: '',
  narration_audio: '',
  show_next: true,
  choices: [],
  hotspots: [],
});

// ─── Story List ──────────────────────────────────────────────
export default function StoryEditor() {
  const {
    activities,
    loading,
    createActivity,
    updateActivity,
    deleteActivity,
    togglePublish,
    createStep,
    deleteStep,
    uploadFile,
    refetch,
  } = useActivities();

  const stories = activities.filter((a) => a.type === 'story');
  const [editingStory, setEditingStory] = useState<Activity | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newAgeMin, setNewAgeMin] = useState('');
  const [newAgeMax, setNewAgeMax] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    await createActivity({
      title: newTitle,
      type: 'story',
      age_min: newAgeMin ? parseInt(newAgeMin) : null,
      age_max: newAgeMax ? parseInt(newAgeMax) : null,
      is_published: false,
    });
    setShowCreateDialog(false);
    setNewTitle('');
    setNewAgeMin('');
    setNewAgeMax('');
    setCreating(false);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteActivity(deleteId);
      setDeleteId(null);
    }
  };

  if (editingStory) {
    return (
      <StoryStepEditor
        story={editingStory}
        onBack={() => { setEditingStory(null); refetch(); }}
        onUpload={uploadFile}
        createStep={createStep}
        deleteStep={deleteStep}
        updateActivity={updateActivity}
        togglePublish={togglePublish}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Story Management
          </h2>
          <p className="text-sm text-muted-foreground">{stories.length} stories</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Story
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : stories.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No stories yet. Create one to get started.</CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {stories.map((s) => (
            <Card key={s.id} className="bg-card hover:shadow-sm transition-shadow">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{s.title}</h3>
                    <Badge variant={s.is_published ? 'default' : 'secondary'} className="text-xs">
                      {s.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {s.steps.length} page{s.steps.length !== 1 ? 's' : ''}
                    {s.age_min != null && ` · Ages ${s.age_min}–${s.age_max ?? '?'}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => togglePublish(s.id, s.is_published)} title={s.is_published ? 'Unpublish' : 'Publish'}>
                    {s.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setEditingStory(s)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Create New Story</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., The Friendly Fox" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Age Min</Label>
                <Input type="number" min={1} max={12} value={newAgeMin} onChange={(e) => setNewAgeMin(e.target.value)} placeholder="2" />
              </div>
              <div className="space-y-2">
                <Label>Age Max</Label>
                <Input type="number" min={1} max={12} value={newAgeMax} onChange={(e) => setNewAgeMax(e.target.value)} placeholder="6" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating || !newTitle.trim()}>
              {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Story?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the story and all its pages.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Story Step Editor ──────────────────────────────────────
interface StoryStepEditorProps {
  story: Activity;
  onBack: () => void;
  onUpload: (file: File, bucket?: string) => Promise<string | null>;
  createStep: (activityId: string, step: any) => Promise<any>;
  deleteStep: (stepId: string) => Promise<boolean>;
  updateActivity: (id: string, updates: Partial<CreateActivityInput>) => Promise<boolean>;
  togglePublish: (id: string, current: boolean) => Promise<boolean | undefined>;
}

function StoryStepEditor({ story, onBack, onUpload, createStep, deleteStep, updateActivity, togglePublish }: StoryStepEditorProps) {
  const [steps, setSteps] = useState<{ id: string; step_order: number; data: StoryStepData }[]>([]);
  const [saving, setSaving] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  // Load steps from the story
  useEffect(() => {
    setSteps(
      story.steps
        .sort((a, b) => a.step_order - b.step_order)
        .map((s) => ({
          id: s.id,
          step_order: s.step_order,
          data: { ...emptyStepData(), ...(s.data as any) },
        }))
    );
  }, [story]);

  const addPage = () => {
    const nextOrder = steps.length > 0 ? Math.max(...steps.map((s) => s.step_order)) + 1 : 1;
    const newStep = { id: `new-${Date.now()}`, step_order: nextOrder, data: emptyStepData() };
    setSteps([...steps, newStep]);
    setExpandedIdx(steps.length);
  };

  const removeStep = (idx: number) => {
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const moveStep = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= steps.length) return;
    const copy = [...steps];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    copy.forEach((s, i) => (s.step_order = i + 1));
    setSteps(copy);
    setExpandedIdx(target);
  };

  const updateStepData = (idx: number, field: string, value: any) => {
    setSteps((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, data: { ...s.data, [field]: value } } : s
      )
    );
  };

  const handleFileUpload = async (idx: number, field: string, file: File) => {
    const bucket = field === 'narration_audio' ? 'audio' : 'game assets';
    const url = await onUpload(file, bucket);
    if (url) updateStepData(idx, field, url);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      // Delete all existing steps
      for (const s of story.steps) {
        await deleteStep(s.id);
      }
      // Create new steps in order
      for (const s of steps) {
        await createStep(story.id, {
          game_type: 'tap_identify',
          data: s.data,
          step_order: s.step_order,
        });
      }
      toast.success('Story pages saved!');
      onBack();
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-1">← Back to Stories</Button>
          <h2 className="text-xl font-semibold">{story.title}</h2>
          <p className="text-sm text-muted-foreground">{steps.length} page{steps.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => togglePublish(story.id, story.is_published)}>
            {story.is_published ? <><EyeOff className="h-4 w-4 mr-1" /> Unpublish</> : <><Eye className="h-4 w-4 mr-1" /> Publish</>}
          </Button>
          <Button onClick={saveAll} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Save All Pages
          </Button>
        </div>
      </div>

      {/* Step list */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isExpanded = expandedIdx === idx;
          const pt = PAGE_TYPES.find((p) => p.value === step.data.page_type);
          return (
            <Card key={step.id} className="bg-card">
              {/* Collapsed header */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-xs text-muted-foreground w-6">{idx + 1}</span>
                <Badge variant="outline" className="text-xs">{pt?.label || step.data.page_type}</Badge>
                <span className="text-sm font-medium truncate flex-1">{step.data.page_title || step.data.instruction || '(untitled)'}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); moveStep(idx, -1); }} disabled={idx === 0}>
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); moveStep(idx, 1); }} disabled={idx === steps.length - 1}>
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); removeStep(idx); }}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>

              {/* Expanded editor */}
              {isExpanded && (
                <CardContent className="border-t pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Page Type</Label>
                      <Select value={step.data.page_type} onValueChange={(v) => updateStepData(idx, 'page_type', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {PAGE_TYPES.map((p) => (
                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Page Title</Label>
                      <Input value={step.data.page_title} onChange={(e) => updateStepData(idx, 'page_title', e.target.value)} placeholder="Optional title" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Instruction / Question</Label>
                    <Input value={step.data.instruction} onChange={(e) => updateStepData(idx, 'instruction', e.target.value)} placeholder="e.g., Tap the bear!" />
                  </div>

                  {(step.data.page_type === 'story' || step.data.page_type === 'ending') && (
                    <div className="space-y-2">
                      <Label>Story Text</Label>
                      <Textarea value={step.data.story_text} onChange={(e) => updateStepData(idx, 'story_text', e.target.value)} placeholder="Once upon a time…" rows={3} />
                    </div>
                  )}

                  {/* Illustration upload */}
                  <div className="space-y-2">
                    <Label>Illustration</Label>
                    <div className="flex items-center gap-3">
                      <Input value={step.data.illustration} onChange={(e) => updateStepData(idx, 'illustration', e.target.value)} placeholder="URL or upload" className="flex-1" />
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFileUpload(idx, 'illustration', e.target.files[0]); }} />
                        <div className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md bg-background hover:bg-accent transition-colors">
                          <Upload className="h-4 w-4" /> Upload
                        </div>
                      </label>
                    </div>
                    {step.data.illustration && (
                      <img src={step.data.illustration} alt="preview" className="w-20 h-20 object-contain rounded-lg border" />
                    )}
                  </div>

                  {/* Narration upload */}
                  <div className="space-y-2">
                    <Label>Narration Audio</Label>
                    <div className="flex items-center gap-3">
                      <Input value={step.data.narration_audio} onChange={(e) => updateStepData(idx, 'narration_audio', e.target.value)} placeholder="URL or upload" className="flex-1" />
                      <label className="cursor-pointer">
                        <input type="file" accept="audio/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFileUpload(idx, 'narration_audio', e.target.files[0]); }} />
                        <div className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md bg-background hover:bg-accent transition-colors">
                          <Upload className="h-4 w-4" /> Upload
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Show Next toggle */}
                  {step.data.page_type === 'story' && (
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <Label>Show Next Button</Label>
                      <Switch checked={step.data.show_next} onCheckedChange={(v) => updateStepData(idx, 'show_next', v)} />
                    </div>
                  )}

                  {/* Question choices */}
                  {step.data.page_type === 'question' && (
                    <ChoicesEditor
                      choices={step.data.choices}
                      onChange={(c) => updateStepData(idx, 'choices', c)}
                    />
                  )}

                  {/* Hotspots */}
                  {step.data.page_type === 'tap_object' && (
                    <HotspotsEditor
                      hotspots={step.data.hotspots}
                      onChange={(h) => updateStepData(idx, 'hotspots', h)}
                    />
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <Button variant="outline" onClick={addPage} className="w-full border-dashed">
        <Plus className="h-4 w-4 mr-2" /> Add Page
      </Button>
    </div>
  );
}

// ─── Choices Editor ──────────────────────────────────────────
function ChoicesEditor({ choices, onChange }: { choices: { label: string; image: string; correct: boolean }[]; onChange: (c: any[]) => void }) {
  const add = () => onChange([...choices, { label: '', image: '', correct: false }]);
  const remove = (i: number) => onChange(choices.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, val: any) =>
    onChange(choices.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)));

  return (
    <div className="space-y-3">
      <Label className="font-medium">Answer Choices</Label>
      {choices.map((c, i) => (
        <div key={i} className="flex items-center gap-2 p-2 border rounded-lg">
          <Input value={c.label} onChange={(e) => update(i, 'label', e.target.value)} placeholder="Label" className="flex-1" />
          <Input value={c.image} onChange={(e) => update(i, 'image', e.target.value)} placeholder="Image URL" className="flex-1" />
          <div className="flex items-center gap-1">
            <Switch checked={c.correct} onCheckedChange={(v) => update(i, 'correct', v)} />
            <span className="text-xs text-muted-foreground">✓</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(i)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add}><Plus className="h-3 w-3 mr-1" /> Add Choice</Button>
    </div>
  );
}

// ─── Hotspots Editor ─────────────────────────────────────────
function HotspotsEditor({ hotspots, onChange }: { hotspots: { id: string; x: number; y: number; width: number; height: number; label: string; correct: boolean }[]; onChange: (h: any[]) => void }) {
  const add = () => onChange([...hotspots, { id: `hs-${Date.now()}`, x: 20, y: 20, width: 20, height: 20, label: '', correct: true }]);
  const remove = (i: number) => onChange(hotspots.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, val: any) =>
    onChange(hotspots.map((h, idx) => (idx === i ? { ...h, [field]: val } : h)));

  return (
    <div className="space-y-3">
      <Label className="font-medium">Hotspots (% coordinates)</Label>
      {hotspots.map((h, i) => (
        <div key={h.id} className="grid grid-cols-6 gap-2 p-2 border rounded-lg items-center">
          <Input value={h.label} onChange={(e) => update(i, 'label', e.target.value)} placeholder="Label" className="col-span-2" />
          <Input type="number" value={h.x} onChange={(e) => update(i, 'x', +e.target.value)} placeholder="X%" />
          <Input type="number" value={h.y} onChange={(e) => update(i, 'y', +e.target.value)} placeholder="Y%" />
          <Input type="number" value={h.width} onChange={(e) => update(i, 'width', +e.target.value)} placeholder="W%" />
          <div className="flex items-center gap-1">
            <Input type="number" value={h.height} onChange={(e) => update(i, 'height', +e.target.value)} placeholder="H%" className="w-full" />
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive shrink-0" onClick={() => remove(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add}><Plus className="h-3 w-3 mr-1" /> Add Hotspot</Button>
    </div>
  );
}
