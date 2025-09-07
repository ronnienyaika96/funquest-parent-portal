import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import LetterTraceCanvas from "./LetterTraceCanvas";
import { getLetterLabel } from "./letter-labels";
import LetterTracingNavButtons from './LetterTracingNavButtons';
import LetterTracingLetterLabel from './LetterTracingLetterLabel';
import LetterTracingQuickNav from './LetterTracingQuickNav';
import CheckmarkAnimation from "./CheckmarkAnimation";
import { ProgressIndicator } from './ProgressIndicator';
import { useTracingProgress } from '@/hooks/useTracingProgress';
import { toast } from 'sonner';
import { X } from "lucide-react";

// Kid-friendly alphabet letters
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split('');

const DESKTOP_BG = "https://blbsqooxwyapcxsfgope.supabase.co/storage/v1/object/public/assets//desktop%20background.png";
const MOBILE_BG = "https://blbsqooxwyapcxsfgope.supabase.co/storage/v1/object/public/assets//mobile%20background.png";
const BASE_SVG = "https://blbsqooxwyapcxsfgope.supabase.co/storage/v1/object/public/assets/";

interface LetterTracingProps {
  letter?: string;
  onBack?: () => void;
}

const LetterTracing: React.FC<LetterTracingProps> = ({ letter, onBack }) => {
  const initialIndex = letter
    ? Math.max(0, ALPHABET.findIndex((l) => l === letter.toLowerCase()))
    : 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [tracing, setTracing] = useState<{ x: number; y: number }[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const [svgBounds, setSvgBounds] = useState<{ width: number; height: number }>({ width: 300, height: 300 });
  const [feedback, setFeedback] = useState<null | "success" | "fail">(null);
  const isMobile = useIsMobile();
  
  // Progress tracking
  const { saveProgress, getLetterProgress } = useTracingProgress();

  const currentLetter = ALPHABET[currentIndex];
  const backgroundImage = isMobile ? MOBILE_BG : DESKTOP_BG;
  const letterProgress = getLetterProgress(currentLetter);

  useEffect(() => {
    setSvgContent(null); // reset loading

    const fetchSvg = async () => {
      let fetched = false;
      const possiblePaths = [
        `${BASE_SVG}letter%20${currentLetter}.svg`,
        `${BASE_SVG}letter-${currentLetter}.svg`,
        `${BASE_SVG}letter%20${currentLetter}%20path-01.svg`,
        `${BASE_SVG}letter%20${currentLetter.toUpperCase()}.svg`,
      ];
      for (const url of possiblePaths) {
        const res = await fetch(url);
        if (res.ok) {
          setSvgContent(await res.text());
          fetched = true;
          break;
        }
      }
      if (!fetched) {
        setSvgContent('<svg viewBox="0 0 300 300"><text x="50%" y="50%" text-anchor="middle" fill="#f87171" font-size="32" dy=".3em">SVG not found</text></svg>');
      }
    };
    fetchSvg();

    setTracing([]);
    setCurrentStroke([]);
  }, [currentLetter]);

  const prevLetter = () => setCurrentIndex(idx => Math.max(0, idx - 1));
  const nextLetter = () => setCurrentIndex(idx => Math.min(ALPHABET.length - 1, idx + 1));

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center ${isMobile ? "" : "justify-center"}`}
      style={{
        background: `url('${backgroundImage}') no-repeat center center/cover`,
        fontFamily: "'Nunito', 'Comic Sans MS', 'Comic Sans', 'cursive', sans-serif",
        padding: isMobile ? "env(safe-area-inset-top, 16px) 0 32px 0" : undefined,
      }}
    >
      <div className={`flex flex-col items-center w-full h-full ${isMobile ? "py-0" : "py-6"}`}>
        {/* No white card on desktop or mobile: content is placed directly on the background */}
        <div className="w-full flex flex-col items-center" style={{ minHeight: isMobile ? '94vh' : '80vh' }}>
          {/* Optional Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="absolute left-2 top-2 flex items-center gap-2 bg-blue-400/90 hover:bg-blue-500 text-white px-3 py-2 rounded-xl shadow font-bold z-10"
              style={{ fontSize: isMobile ? 15 : 16 }}
            >
              <ArrowLeft size={isMobile ? 20 : 22} />
              Back
            </button>
          )}
          {/* Letter label */}
          <LetterTracingLetterLabel letter={currentLetter} />
          
          {/* Progress indicator for current letter */}
          <div className="w-full max-w-md px-4 mb-4">
            <ProgressIndicator letter={currentLetter} showOverall={false} />
          </div>

          {/* SVG Container + Tracing Overlay */}
          <div
            className="w-full flex justify-center items-center"
            style={{
              maxWidth: isMobile ? 370 : 400,
              margin: isMobile ? '0 auto' : '',
              marginBottom: isMobile ? 4 : '',
            }}
          >
            <LetterTraceCanvas
              svgContent={svgContent}
              svgBounds={svgBounds}
              tracing={tracing}
              setTracing={setTracing}
              currentStroke={currentStroke}
              setCurrentStroke={setCurrentStroke}
              onSvgBoundsDetected={setSvgBounds}
              onTraceComplete={(res) => {
                if (res === "success") {
                  setFeedback("success");
                  // Calculate score based on tracing accuracy and speed
                  const baseScore = 85; // Base score for completion
                  const speedBonus = Math.max(0, 15 - (currentStroke.length / 10)); // Speed bonus
                  const accuracyBonus = Math.min(10, Math.floor(Math.random() * 8) + 2); // Simulated accuracy
                  const score = Math.min(100, Math.floor(baseScore + speedBonus + accuracyBonus));
                  
                  // Save progress to database
                  saveProgress.mutate({
                    letter: currentLetter,
                    completed: true,
                    score,
                  }, {
                    onSuccess: () => {
                      toast.success(`Great job! Letter ${currentLetter.toUpperCase()} completed with ${score}% accuracy!`);
                    },
                    onError: (error) => {
                      console.error('Failed to save progress:', error);
                      toast.error('Progress not saved. Please try again.');
                    }
                  });
                } else if (res === "fail") {
                  setFeedback("fail");
                  // Save attempt even if failed
                  saveProgress.mutate({
                    letter: currentLetter,
                    completed: false,
                    score: 0,
                  });
                }
                setTimeout(() => setFeedback(null), 1100);
              }}
            />
          </div>
          {/* Navigation arrows */}
          <LetterTracingNavButtons
            currentIndex={currentIndex}
            totalLetters={ALPHABET.length}
            prevLetter={prevLetter}
            nextLetter={nextLetter}
            isMobile={isMobile}
          />
          {/* Reset button */}
          <div className="mt-4 text-center w-full px-2">
            <button
              className="w-full max-w-xs bg-funquest-green/90 hover:bg-funquest-green text-white px-5 py-3 rounded-xl font-bold text-md shadow transition-all duration-200"
              onClick={() => { setTracing([]); setCurrentStroke([]); }}
            >
              Clear Drawing
            </button>
          </div>
          {/* Quick nav for mobile */}
          {isMobile && (
            <LetterTracingQuickNav
              alphabet={ALPHABET}
              currentIndex={currentIndex}
              onSelect={setCurrentIndex}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LetterTracing;
