import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Type,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NarrationControlsProps {
  supported: boolean;
  speaking: boolean;
  paused: boolean;
  muted: boolean;
  rate: number;
  volume: number;
  voices: SpeechSynthesisVoice[];
  voiceURI: string | null;
  autoTurn: boolean;
  canPrev: boolean;
  canNext: boolean;
  hasText: boolean;
  textSize: number;
  onToggle: () => void;
  onRestart: () => void;
  onPrev: () => void;
  onNext: () => void;
  onAutoTurn: (v: boolean) => void;
  onMuted: (v: boolean) => void;
  onRate: (v: number) => void;
  onVolume: (v: number) => void;
  onVoice: (v: string) => void;
  onTextSize: (v: number) => void;
}

const NarrationControls: React.FC<NarrationControlsProps> = ({
  supported,
  speaking,
  paused,
  muted,
  rate,
  volume,
  voices,
  voiceURI,
  autoTurn,
  canPrev,
  canNext,
  hasText,
  textSize,
  onToggle,
  onRestart,
  onPrev,
  onNext,
  onAutoTurn,
  onMuted,
  onRate,
  onVolume,
  onVoice,
  onTextSize,
}) => {
  const playLabel = !speaking ? 'Read aloud' : paused ? 'Resume narration' : 'Pause narration';

  return (
    <div className="bg-card/95 backdrop-blur-md rounded-3xl shadow-strong border border-border/40 p-3 sm:p-4">
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        <Button
          variant="secondary"
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="Previous page"
          className="rounded-full min-w-[56px] min-h-[56px]"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          onClick={onToggle}
          disabled={!supported || !hasText}
          aria-label={playLabel}
          className="rounded-full min-w-[64px] min-h-[64px] bg-funquest-purple hover:bg-funquest-purple/90"
        >
          {speaking && !paused ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
        </Button>

        <Button
          variant="secondary"
          onClick={onRestart}
          disabled={!supported || !hasText}
          aria-label="Restart narration"
          className="rounded-full min-w-[56px] min-h-[56px]"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          variant="secondary"
          onClick={() => onMuted(!muted)}
          aria-label={muted ? 'Unmute narration' : 'Mute narration'}
          className="rounded-full min-w-[56px] min-h-[56px]"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>

        <Button
          variant="secondary"
          onClick={onNext}
          disabled={!canNext}
          aria-label="Next page"
          className="rounded-full min-w-[56px] min-h-[56px]"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {!supported && (
        <p className="text-center text-xs text-muted-foreground mt-2">
          Read aloud isn’t available in this browser — you can still read the story.
        </p>
      )}

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
        <label className="flex items-center justify-between gap-2 bg-muted/50 rounded-2xl px-3 py-2 min-h-[48px]">
          <span className="text-sm font-bold text-foreground">Auto Page Turn</span>
          <Switch checked={autoTurn} onCheckedChange={onAutoTurn} aria-label="Auto page turn" />
        </label>

        <div className="flex items-center gap-2 bg-muted/50 rounded-2xl px-3 py-2 min-h-[48px]">
          <Type className="w-4 h-4 text-muted-foreground" aria-hidden />
          <Slider
            value={[textSize]}
            min={16}
            max={34}
            step={2}
            onValueChange={([v]) => onTextSize(v)}
            aria-label="Text size"
          />
        </div>

        <div className="flex items-center gap-2 bg-muted/50 rounded-2xl px-3 py-2 min-h-[48px]">
          <span className="text-xs font-bold text-muted-foreground shrink-0">Speed</span>
          <Slider
            value={[rate]}
            min={0.5}
            max={1.5}
            step={0.1}
            onValueChange={([v]) => onRate(v)}
            aria-label="Narration speed"
          />
          <span className="text-xs font-bold text-foreground w-8 text-right">{rate.toFixed(1)}x</span>
        </div>

        <div className="flex items-center gap-2 bg-muted/50 rounded-2xl px-3 py-2 min-h-[48px]">
          <Volume2 className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden />
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([v]) => onVolume(v)}
            aria-label="Narration volume"
          />
        </div>
      </div>

      {voices.length > 0 && (
        <div className="mt-3">
          <Select value={voiceURI ?? undefined} onValueChange={onVoice}>
            <SelectTrigger className="rounded-2xl min-h-[48px]" aria-label="Narration voice">
              <SelectValue placeholder="Choose a voice" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {voices.map((v) => (
                <SelectItem key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default NarrationControls;
