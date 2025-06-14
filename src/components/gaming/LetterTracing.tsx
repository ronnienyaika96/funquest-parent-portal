import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import LetterTraceCanvas from "./LetterTraceCanvas";
import { getLetterLabel } from "./letter-labels";

// Kid-friendly alphabet letters
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split('');

const DESKTOP_BG = "https://blbsqooxwyapcxsfgope.supabase.co/storage/v1/object/public/assets//desktop%20background.png";
const MOBILE_BG = "https://blbsqooxwyapcxsfgope.supabase.co/storage/v1/object/public/assets//mobile%20background.png";
const BASE_SVG = "https://blbsqooxwyapcxsfgope.supabase.co/storage/v1/object/public/assets/";

// Convert lowercase to path, e.g., "a" -> "letter a path-01.svg"
function getLetterSvgPath(letter: string): string {
  // Try several common file naming patterns for maximum compatibility
  return (
    `${BASE_SVG}letter%20${letter}.svg`
  );
}

interface LetterTracingProps {
  letter?: string;
  onBack?: () => void;
}

const LetterTracing: React.FC<LetterTracingProps> = ({ letter, onBack }) => {
  // If letter prop present, start with it, otherwise default to 0
  const initialIndex = letter
    ? Math.max(0, ALPHABET.findIndex((l) => l === letter.toLowerCase()))
    : 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [tracing, setTracing] = useState<{ x: number; y: number }[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const [svgBounds, setSvgBounds] = useState<{ width: number; height: number }>({ width: 300, height: 300 });
  const isMobile = useIsMobile();

  const currentLetter = ALPHABET[currentIndex];
  const backgroundImage = isMobile ? MOBILE_BG : DESKTOP_BG;

  useEffect(() => {
    setSvgContent(null); // reset loading

    // Try fetching the most likely file
    const fetchSvg = async () => {
      let fetched = false;
      // Try several naming patterns
      const possiblePaths = [
        `${BASE_SVG}letter%20${currentLetter}.svg`,                  // letter b.svg
        `${BASE_SVG}letter-${currentLetter}.svg`,                   // letter-b.svg
        `${BASE_SVG}letter%20${currentLetter}%20path-01.svg`,       // letter b path-01.svg
        `${BASE_SVG}letter%20${currentLetter.toUpperCase()}.svg`,   // letter B.svg
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
      className="min-h-screen w-full flex flex-col items-center justify-center"
      style={{
        background: `url('${backgroundImage}') no-repeat center center/cover`,
        fontFamily: "'Nunito', 'Comic Sans MS', 'Comic Sans', 'cursive', sans-serif"
      }}
    >
      <div className="flex flex-col items-center w-full h-full py-6">
        {/* MAIN GAME PANEL */}
        <div className="bg-white/80 rounded-[2rem] shadow-2xl p-4 md:p-8 w-[97vw] max-w-xl mt-10 mb-8 border-4 border-yellow-200 flex flex-col items-center relative">
          {/* Optional Back Button (for context navigation) */}
          {onBack && (
            <button
              onClick={onBack}
              className="absolute left-4 top-4 flex items-center gap-2 bg-funquest-blue/70 hover:bg-funquest-blue text-white px-4 py-2 rounded-xl shadow-md font-bold z-10"
            >
              <ArrowLeft size={22} />
              Back
            </button>
          )}
          {/* Letter label */}
          <div className="text-center mb-2 mt-2">
            <span className="text-5xl md:text-6xl font-extrabold drop-shadow text-funquest-blue" style={{
              letterSpacing: '0.09em',
              textShadow: "0px 4px 16px #a6e0ff"
            }}>
              {currentLetter.toUpperCase()}
            </span>
            <span className="block text-lg md:text-2xl font-medium text-funquest-green animate-pulse">{getLetterLabel(currentLetter)}</span>
          </div>
          {/* SVG Container + Tracing Overlay */}
          <LetterTraceCanvas
            svgContent={svgContent}
            svgBounds={svgBounds}
            tracing={tracing}
            setTracing={setTracing}
            currentStroke={currentStroke}
            setCurrentStroke={setCurrentStroke}
            onSvgBoundsDetected={setSvgBounds}
          />
          {/* Navigation arrows */}
          <div className="mt-6 flex items-center justify-between gap-10 w-full px-6">
            <button
              className="bg-funquest-blue/90 px-5 py-3 rounded-2xl shadow-lg hover:bg-funquest-blue text-white font-bold text-xl transition-all duration-100 disabled:opacity-50"
              style={{ minWidth: 56, border: 'none' }}
              disabled={currentIndex === 0}
              onClick={prevLetter}
              aria-label="Previous letter"
            >
              <ArrowLeft size={30} />
            </button>
            <button
              className="bg-funquest-orange/90 px-5 py-3 rounded-2xl shadow-lg hover:bg-funquest-orange text-white font-bold text-xl transition-all duration-100 disabled:opacity-50"
              style={{ minWidth: 56, border: 'none' }}
              disabled={currentIndex === ALPHABET.length - 1}
              onClick={nextLetter}
              aria-label="Next letter"
            >
              <ArrowRight size={30} />
            </button>
          </div>
          {/* Reset button */}
          <div className="mt-4 text-center">
            <button
              className="bg-funquest-green/80 hover:bg-funquest-green text-white px-5 py-2 rounded-xl font-bold text-md shadow"
              onClick={() => { setTracing([]); setCurrentStroke([]); }}
            >
              Clear drawing
            </button>
          </div>
        </div>
        {/* Footer: ABC quick nav for mobile */}
        {isMobile && (
          <div className="mt-2 w-full px-2 flex flex-wrap justify-center space-x-1">
            {ALPHABET.map((l, idx) => (
              <button
                key={l}
                className={`rounded-full m-1 px-3 py-2 font-extrabold text-lg border-2 hover:scale-105 transition bg-white/80 ${
                  idx === currentIndex ? "bg-funquest-blue text-white border-funquest-blue scale-110 shadow-lg" : "border-gray-300 text-funquest-blue"
                }`}
                aria-label={`Jump to letter ${l.toUpperCase()}`}
                onClick={() => setCurrentIndex(idx)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LetterTracing;
