import React from 'react';
import { Volume2 } from 'lucide-react';
import { getAssetUrl } from '@/pages/PlayActivityPage';

interface InstructionBarProps {
  text: string;
  audioUrl?: string | null;
}

const InstructionBar: React.FC<InstructionBarProps> = ({ text, audioUrl }) => {
  const playAudio = () => {
    if (!audioUrl) return;
    new Audio(getAssetUrl(audioUrl)).play().catch(() => {});
  };

  return (
    <div className="flex items-center justify-center gap-3 bg-card/90 backdrop-blur-sm border border-border/60 rounded-2xl px-5 py-3.5 shadow-soft max-w-md mx-auto">
      <p className="text-lg sm:text-xl font-bold text-foreground text-center leading-snug">{text}</p>
      {audioUrl && (
        <button
          onClick={playAudio}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-funquest-blue/15 hover:bg-funquest-blue/25 flex items-center justify-center transition-colors active:scale-95"
        >
          <Volume2 className="w-5 h-5 text-funquest-blue" />
        </button>
      )}
    </div>
  );
};

export default InstructionBar;
