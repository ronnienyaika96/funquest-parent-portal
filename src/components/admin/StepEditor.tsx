import { useState } from 'react';
import { ActivityStep } from '@/hooks/useActivities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SingleMediaUploader } from './MediaUploader';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const GAME_TYPES = [
  { value: 'tracing', label: 'Letter Tracing' },
  { value: 'tap_identify', label: 'Tap & Identify' },
  { value: 'drag_drop_match', label: 'Drag & Drop Match' },
  { value: 'coloring', label: 'Coloring' },
  { value: 'quiz', label: 'Quiz' },
];

export interface StepFormData {
  id?: string;
  game_type: string;
  data: Record<string, any>;
  instruction_audio_url: string | null;
  step_order: number;
}

interface StepEditorProps {
  steps: StepFormData[];
  onChange: (steps: StepFormData[]) => void;
  onUpload: (file: File) => Promise<string | null>;
}

export function StepEditor({ steps, onChange, onUpload }: StepEditorProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const addStep = () => {
    const newStep: StepFormData = {
      game_type: 'tap_identify',
      data: { instruction: '', image_url: '', options: [] },
      instruction_audio_url: null,
      step_order: steps.length + 1,
    };
    onChange([...steps, newStep]);
    setExpandedStep(steps.length);
  };

  const updateStep = (index: number, updates: Partial<StepFormData>) => {
    onChange(steps.map((step, i) => (i === index ? { ...step, ...updates } : step)));
  };

  const updateStepData = (index: number, key: string, value: any) => {
    const step = steps[index];
    updateStep(index, { data: { ...step.data, key, [key]: value } });
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, step_order: i + 1 }));
    onChange(newSteps);
    if (expandedStep === index) setExpandedStep(null);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) return;
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    onChange(newSteps.map((s, i) => ({ ...s, step_order: i + 1 })));
    setExpandedStep(targetIndex);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Activity Steps</Label>
        <Button type="button" variant="outline" size="sm" onClick={addStep}>
          <Plus className="h-4 w-4 mr-1" />
          Add Step
        </Button>
      </div>

      {steps.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground text-sm">No steps defined yet</p>
            <Button type="button" variant="ghost" size="sm" onClick={addStep} className="mt-2">
              <Plus className="h-4 w-4 mr-1" />
              Add your first step
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {steps.map((step, index) => (
            <Card
              key={index}
              className={cn('transition-all', expandedStep === index && 'ring-2 ring-primary')}
            >
              <CardHeader
                className="py-3 px-4 cursor-pointer"
                onClick={() => setExpandedStep(expandedStep === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {index + 1}
                  </span>
                  <CardTitle className="text-sm flex-1 capitalize">{step.game_type.replace(/_/g, ' ')}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7"
                      onClick={(e) => { e.stopPropagation(); moveStep(index, 'up'); }}
                      disabled={index === 0}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7"
                      onClick={(e) => { e.stopPropagation(); moveStep(index, 'down'); }}
                      disabled={index === steps.length - 1}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); removeStep(index); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedStep === index && (
                <CardContent className="pt-0 pb-4 px-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Game Type</Label>
                      <Select value={step.game_type} onValueChange={(v) => updateStep(index, { game_type: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {GAME_TYPES.map((gt) => (
                            <SelectItem key={gt.value} value={gt.value}>{gt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <SingleMediaUploader
                      label="Audio Instruction"
                      accept=".mp3,.wav,.ogg,.m4a"
                      value={step.instruction_audio_url}
                      onChange={(url) => updateStep(index, { instruction_audio_url: url })}
                      onUpload={onUpload}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Instruction Text</Label>
                    <Textarea
                      value={step.data.instruction || ''}
                      onChange={(e) => updateStepData(index, 'instruction', e.target.value)}
                      placeholder="Tell the child what to do..."
                      rows={2}
                    />
                  </div>

                  <SingleMediaUploader
                    label="Step Image / SVG"
                    accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                    value={step.data.image_url || null}
                    onChange={(url) => updateStepData(index, 'image_url', url || '')}
                    onUpload={onUpload}
                  />

                  {/* Game-type specific: tracing needs svg_path */}
                  {step.game_type === 'tracing' && (
                    <div className="space-y-2">
                      <Label>SVG Trace Path (d attribute)</Label>
                      <Textarea
                        value={step.data.svg_path || ''}
                        onChange={(e) => updateStepData(index, 'svg_path', e.target.value)}
                        placeholder="M 10 80 C 40 10, 65 10, 95 80..."
                        rows={2}
                      />
                    </div>
                  )}

                  {/* Tap identify: correct answer */}
                  {(step.game_type === 'tap_identify' || step.game_type === 'drag_drop_match') && (
                    <div className="space-y-2">
                      <Label>Correct Answer / Match Value</Label>
                      <Input
                        value={step.data.correct_answer || ''}
                        onChange={(e) => updateStepData(index, 'correct_answer', e.target.value)}
                        placeholder="e.g., A"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Step Data (raw JSON, advanced)</Label>
                    <Textarea
                      value={JSON.stringify(step.data, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          updateStep(index, { data: parsed });
                        } catch {
                          // invalid JSON, ignore
                        }
                      }}
                      rows={4}
                      className="font-mono text-xs"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
