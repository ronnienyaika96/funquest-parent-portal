import { useState } from 'react';
import { ActivityStep } from '@/hooks/useActivities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SingleMediaUploader } from './MediaUploader';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepEditorProps {
  steps: ActivityStep[];
  onChange: (steps: ActivityStep[]) => void;
  onUpload: (file: File) => Promise<string | null>;
}

export function StepEditor({ steps, onChange, onUpload }: StepEditorProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const addStep = () => {
    const newStep: ActivityStep = {
      id: crypto.randomUUID(),
      title: `Step ${steps.length + 1}`,
      instruction: '',
    };
    onChange([...steps, newStep]);
    setExpandedStep(newStep.id);
  };

  const updateStep = (id: string, updates: Partial<ActivityStep>) => {
    onChange(steps.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ));
  };

  const removeStep = (id: string) => {
    onChange(steps.filter(step => step.id !== id));
    if (expandedStep === id) {
      setExpandedStep(null);
    }
  };

  const moveStep = (id: string, direction: 'up' | 'down') => {
    const index = steps.findIndex(step => step.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    onChange(newSteps);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Activity Steps</label>
        <Button type="button" variant="outline" size="sm" onClick={addStep}>
          <Plus className="h-4 w-4 mr-1" />
          Add Step
        </Button>
      </div>

      {steps.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground text-sm">No steps defined yet</p>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={addStep}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add your first step
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {steps.map((step, index) => (
            <Card 
              key={step.id}
              className={cn(
                "transition-all",
                expandedStep === step.id && "ring-2 ring-primary"
              )}
            >
              <CardHeader 
                className="py-3 px-4 cursor-pointer"
                onClick={() => setExpandedStep(
                  expandedStep === step.id ? null : step.id
                )}
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {index + 1}
                  </span>
                  <CardTitle className="text-sm flex-1">{step.title}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => { e.stopPropagation(); moveStep(step.id, 'up'); }}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => { e.stopPropagation(); moveStep(step.id, 'down'); }}
                      disabled={index === steps.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); removeStep(step.id); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedStep === step.id && (
                <CardContent className="pt-0 pb-4 px-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Step Title</label>
                    <Input
                      value={step.title}
                      onChange={(e) => updateStep(step.id, { title: e.target.value })}
                      placeholder="e.g., Trace the letter A"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Instructions</label>
                    <Textarea
                      value={step.instruction}
                      onChange={(e) => updateStep(step.id, { instruction: e.target.value })}
                      placeholder="Describe what the child should do in this step..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SingleMediaUploader
                      label="Step Image/SVG"
                      accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                      value={step.mediaUrl || null}
                      onChange={(url) => updateStep(step.id, { mediaUrl: url || undefined })}
                      onUpload={onUpload}
                    />

                    <SingleMediaUploader
                      label="Audio Instruction"
                      accept=".mp3,.wav,.ogg,.m4a"
                      value={step.audioUrl || null}
                      onChange={(url) => updateStep(step.id, { audioUrl: url || undefined })}
                      onUpload={onUpload}
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
