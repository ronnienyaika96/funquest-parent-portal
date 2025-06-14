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

    // Try fetching the most likely file(s) - no change here, robust as before
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
        {/* MAIN GAME PANEL */}
        <div
          className={`bg-white/95 rounded-t-3xl rounded-b-2xl shadow-xl w-full flex flex-col items-center border-y-0 border-x-0 
            ${isMobile ? "mt-0 mb-2 pt-4 pb-8 px-2 min-h-[85vh] max-w-full border-b-0" : "mt-10 mb-8 p-8 max-w-xl border-4 p-8"}
          `}
          style={{
            backdropFilter: 'blur(2px)',
            minHeight: isMobile ? '80vh' : undefined,
            boxShadow: isMobile 
              ? "0 2px 24px 0px #fca5a533"
              : "0 6px 36px 0px #bae6fd60",
          }}
        >
          {/* Optional Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className={`absolute left-2 top-2 flex items-center gap-2 bg-blue-400/90 hover:bg-blue-500 text-white px-3 py-2 rounded-xl shadow font-bold z-10 ${isMobile ? "top-2 left-2 text-base" : ""}`}
              style={{ fontSize: isMobile ? 15 : 16 }}
            >
              <ArrowLeft size={isMobile ? 20 : 22} />
              Back
            </button>
          )}
          {/* Letter label */}
          <div className={`text-center mb-2 mt-6`}>
            <span className="text-5xl font-extrabold drop-shadow text-funquest-blue" style={{
              letterSpacing: '0.08em',
              textShadow: "0px 4px 16px #a6e0ff"
            }}>
              {currentLetter.toUpperCase()}
            </span>
            <span className="block text-lg font-medium text-funquest-green animate-pulse">{getLetterLabel(currentLetter)}</span>
          </div>

          {/* SVG Container + Tracing Overlay */}
          <div
            className="w-full flex justify-center items-center"
            style={{
              maxWidth: isMobile ? 370 : 400,
              margin: isMobile ? '0 auto' : '',
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
            />
          </div>

          {/* Navigation arrows */}
          <div className={`mt-6 flex items-center justify-between gap-10 w-full px-6 max-w-xs mx-auto ${isMobile ? "mt-3 gap-4" : ""}`}>
            <button
              className={`transition-all duration-100 disabled:opacity-40 rounded-full border-4 p-0 shadow-xl focus:outline-none
                ${currentIndex === 0
                  ? "bg-gray-200 border-gray-300 cursor-default"
                  : "bg-blue-600 hover:bg-blue-700 border-blue-700"}
                flex items-center justify-center`}
              disabled={currentIndex === 0}
              onClick={prevLetter}
              aria-label="Previous letter"
              style={{
                minWidth: 48, minHeight: 48, fontSize: 22,
                boxShadow: currentIndex === 0 ? 'none' : '0 2px 14px #60a5fad9'
              }}
            >
              <ArrowLeft size={32} color={currentIndex === 0 ? "#7dd3fc" : "#fff"} />
            </button>
            <button
              className={`transition-all duration-100 disabled:opacity-40 rounded-full border-4 p-0 shadow-xl focus:outline-none
                ${currentIndex === ALPHABET.length - 1
                  ? "bg-gray-200 border-gray-300 cursor-default"
                  : "bg-orange-500 hover:bg-orange-600 border-orange-600"}
                flex items-center justify-center`}
              disabled={currentIndex === ALPHABET.length - 1}
              onClick={nextLetter}
              aria-label="Next letter"
              style={{
                minWidth: 48, minHeight: 48, fontSize: 22,
                boxShadow: currentIndex === ALPHABET.length - 1 ? 'none' : '0 2px 14px #fdba74d9'
              }}
            >
              <ArrowRight size={32} color={currentIndex === ALPHABET.length - 1 ? "#fdba74" : "#fff"} />
            </button>
          </div>

          {/* Reset button */}
          <div className={`mt-4 text-center w-full px-2`}>
            <button
              className="w-full max-w-xs bg-funquest-green/90 hover:bg-funquest-green text-white px-5 py-3 rounded-xl font-bold text-md shadow transition-all duration-200"
              onClick={() => { setTracing([]); setCurrentStroke([]); }}
            >
              Clear Drawing
            </button>
          </div>
        </div>
        {/* Footer: ABC quick nav for mobile */}
        {isMobile && (
          <div className="mt-2 w-full px-2 flex flex-wrap justify-center gap-1">
            {ALPHABET.map((l, idx) => (
              <button
                key={l}
                className={`rounded-full m-1 px-3 py-2 font-extrabold text-lg border-2 hover:scale-105 transition bg-white/95 ${
                  idx === currentIndex ? "bg-funquest-blue text-white border-funquest-blue scale-110 shadow-lg" : "border-gray-300 text-funquest-blue"
                }`}
                aria-label={`Jump to letter ${l.toUpperCase()}`}
                onClick={() => setCurrentIndex(idx)}
                style={{ minWidth: 38, minHeight: 38, fontSize: 18 }}
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
