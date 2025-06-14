
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Kid-friendly alphabet letters
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split('');

const DESKTOP_BG = "https://blbsqooxwyapcxsfgope.supabase.co/storage/v1/object/public/assets//desktop%20background.png";
const MOBILE_BG = "https://blbsqooxwyapcxsfgope.supabase.co/storage/v1/object/public/assets//mobile%20background.png";
const BASE_SVG = "https://blbsqooxwyapcxsfgope.supabase.co/storage/v1/object/public/assets/";

// Convert lowercase to path, e.g., "a" -> "letter a path-01.svg"
function getLetterSvgPath(letter: string): string {
  // Accept both safe fallback and generic dynamic (see user instructions)
  if (letter === "a") {
    return `${BASE_SVG}letter%20a%20path-01.svg`;
  }
  return `${BASE_SVG}letter-${letter}.svg`;
}

const getLetterLabel = (letter: string) => {
  // Friendly example text
  const examples: Record<string, string> = {
    a: '🍎 Apple', b: '🐝 Bee', c: '🐱 Cat', d: '🐶 Dog', e: '🥚 Egg',
    f: '🐸 Frog', g: '🦒 Giraffe', h: '🏠 House', i: '🍦 Ice Cream',
    j: '🤹‍♂️ Juggle', k: '🦘 Kangaroo', l: '🦁 Lion', m: '🌝 Moon',
    n: '🐧 Nest', o: '🐙 Octopus', p: '🦜 Parrot', q: '👑 Queen',
    r: '🤖 Robot', s: '🌟 Star', t: '🌳 Tree', u: '☔ Umbrella',
    v: '🎻 Violin', w: '🐋 Whale', x: '❌ X-ray', y: '🛶 Yacht', z: '🦓 Zebra'
  };
  return examples[letter] || '';
};

const LetterTracing: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [tracing, setTracing] = useState<{ x: number; y: number }[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const svgContainer = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const currentLetter = ALPHABET[currentIndex];
  // Choose background based on mobile/desktop
  const backgroundImage = isMobile ? MOBILE_BG : DESKTOP_BG;

  // Load and inline the SVG
  useEffect(() => {
    setSvgContent(null); // Show loading state if needed
    fetch(getLetterSvgPath(currentLetter)).then(async (res) => {
      setSvgContent(await res.text());
    });
    setTracing([]);
    setCurrentStroke([]);
  }, [currentLetter]);

  // *** Drawing logic ***
  // We layer a <svg> over the letter SVG, matching its bounding box, for blue path drawing!
  const [svgBounds, setSvgBounds] = useState<{ width: number; height: number }>({ width: 300, height: 300 });

  // To update svg size when SVG is loaded
  useEffect(() => {
    // parse svg for width and height after loading
    if (!svgContent) return;
    try {
      const temp = document.createElement('div');
      temp.innerHTML = svgContent;
      const svg = temp.querySelector('svg');
      if (svg) {
        const width = Number(svg.getAttribute('width')) || 320;
        const height = Number(svg.getAttribute('height')) || 320;
        setSvgBounds({ width, height });
      }
    } catch(e) {
      setSvgBounds({ width: 320, height: 320 });
    }
  }, [svgContent]);

  // Tracing - draw on overlaid SVG
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!svgContainer.current) return;
    const rect = svgContainer.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    setCurrentStroke([{ x, y }]);
    svgContainer.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!svgContainer.current || currentStroke.length === 0) return;
    const rect = svgContainer.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    setCurrentStroke([...currentStroke, { x, y }]);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (currentStroke.length > 1) {
      setTracing([...tracing, currentStroke]);
    }
    setCurrentStroke([]);
    if (svgContainer.current) svgContainer.current.releasePointerCapture(e.pointerId);
  };

  // Handlers for prev/next buttons
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
          {/* SVG + Tracing Overlay */}
          <div
            ref={svgContainer}
            className="mx-auto my-6 md:my-10 relative bg-funquest-accent/10 rounded-[1.5rem] border-4 border-blue-300 pointer-events-auto touch-none"
            style={{
              width: isMobile ? '90vw' : '380px',
              height: isMobile ? '90vw' : '380px',
              maxWidth: 400,
              maxHeight: 400,
              aspectRatio: '1/1',
              boxShadow: '0 2px 24px 0px #bae6fd60'
            }}
            // SVG/Overlay pointer events
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* Inline SVG Letter - faint gray in background, non-interactive */}
            {svgContent ? (
              <div
                className="absolute inset-0 w-full h-full pointer-events-none select-none flex items-center justify-center"
                style={{ zIndex: 0, opacity: 0.25, filter: 'drop-shadow(0 0 12px #93c5fd)' }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full" style={{ minHeight: 200 }}>
                <span className="text-2xl animate-pulse text-blue-400 font-bold">Loading...</span>
              </div>
            )}
            {/* Overlay SVG for blue tracing lines */}
            <svg
              width={svgBounds.width}
              height={svgBounds.height}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1, overflow: 'visible' }}
            >
              {tracing.map((stroke, i) => (
                <polyline
                  key={i}
                  points={stroke.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={isMobile ? 16 : 10}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity={0.85}
                />
              ))}
              {currentStroke.length > 1 && (
                <polyline
                  points={currentStroke.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth={isMobile ? 16 : 10}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity={0.75}
                />
              )}
            </svg>
          </div>
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
