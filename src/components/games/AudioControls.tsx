import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGameAudio } from '@/hooks/useGameAudio';

interface AudioControlsProps {
  className?: string;
}

/**
 * Global mute / volume control. Settings persist across sessions.
 */
const AudioControls: React.FC<AudioControlsProps> = ({ className = '' }) => {
  const { muted, volume, toggleMute, setVolume } = useGameAudio();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute sound' : 'Mute sound'}
        aria-pressed={muted}
        className="rounded-full w-11 h-11 bg-card/80 backdrop-blur-sm shadow-soft hover:bg-card"
      >
        {muted || volume === 0 ? (
          <VolumeX className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Volume2 className="w-5 h-5 text-foreground" />
        )}
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <button
            aria-label="Volume settings"
            className="hidden sm:block w-2.5 h-11 rounded-full bg-card/60 backdrop-blur-sm hover:bg-card"
          />
        </PopoverTrigger>
        <PopoverContent className="w-48" align="end">
          <p className="text-xs font-semibold text-muted-foreground mb-3">Volume</p>
          <Slider
            value={[muted ? 0 : Math.round(volume * 100)]}
            max={100}
            step={5}
            onValueChange={([v]) => setVolume(v / 100)}
            aria-label="Volume level"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AudioControls;
