import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import InstructionBar from './InstructionBar';
import { getAssetUrl } from '@/pages/PlayActivityPage';

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const BUCKET = 'game assets';

function publicUrl(path: string) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function getNumberPngUrl(n: number) {
  return publicUrl(`Tracing/png/${n}.png`);
}
function getNumberSvgUrl(n: number) {
  return publicUrl(`Tracing/svg/${n}.svg`);
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Convert SVG into a normalized ViewBox + flat list of path points. */
function extractPathData(svgText: string) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) return null;

    const vb = svg.getAttribute('viewBox');
    let viewBox = { x: 0, y: 0, w: 100, h: 100 };
    if (vb) {
      const parts = vb.split(/[\s,]+/).map(Number);
      if (parts.length === 4) viewBox = { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
    } else {
      const w = Number(svg.getAttribute('width')) || 100;
      const h = Number(svg.getAttribute('height')) || 100;
      viewBox = { x: 0, y: 0, w, h };
    }

    // Use the first path; mount svg to DOM temporarily so getPointAtLength works.
    const paths = Array.from(svg.querySelectorAll('path')) as SVGPathElement[];
    const pathDs = paths.map(p => p.getAttribute('d') || '').filter(Boolean);

    const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tempSvg.setAttribute('style', 'position:absolute;width:0;height:0;visibility:hidden');
    document.body.appendChild(tempSvg);

    const checkpoints: { x: number; y: number }[] = [];
    let totalLen = 0;
    pathDs.forEach(d => {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', d);
      tempSvg.appendChild(p);
      const len = p.getTotalLength();
      totalLen += len;
      const samples = Math.max(24, Math.min(120, Math.round(len / 6)));
      for (let i = 0; i <= samples; i++) {
        const pt = p.getPointAtLength((i / samples) * len);
        checkpoints.push({ x: pt.x, y: pt.y });
      }
    });
    document.body.removeChild(tempSvg);

    return { viewBox, pathDs, checkpoints, totalLen };
  } catch {
    return null;
  }
}

/** Fallback: build a path "d" by drawing the digit as text and tracing its outline. We just produce a digit-like line as a fallback. */
function fallbackForNumber(n: number) {
  // Provide simple bezier-ish path strings that look like the digit centered in 100x140 viewBox.
  const paths: Record<number, string[]> = {
    0: ['M50,15 C20,15 20,125 50,125 C80,125 80,15 50,15 Z'],
    1: ['M35,35 L50,20 L50,125'],
    2: ['M22,40 C25,18 75,18 75,45 C75,70 25,90 22,125 L78,125'],
    3: ['M22,30 C30,15 78,15 78,45 C78,65 35,65 50,70 C75,70 80,90 78,110 C75,130 25,130 22,110'],
    4: ['M70,20 L25,85 L80,85 M65,40 L65,125'],
    5: ['M75,20 L30,20 L28,65 C45,55 75,60 75,90 C75,125 30,130 22,110'],
    6: ['M70,22 C40,22 25,65 25,95 C25,125 75,130 75,95 C75,65 30,60 25,80'],
    7: ['M22,22 L80,22 L40,125'],
    8: ['M50,20 C20,20 20,65 50,65 C80,65 80,20 50,20 Z M50,65 C20,65 20,125 50,125 C80,125 80,65 50,65 Z'],
    9: ['M75,80 C75,55 30,50 30,80 C30,105 75,105 75,80 M75,80 C75,110 60,125 30,125'],
    10: ['M20,30 L30,15 L30,125', 'M55,70 C55,30 95,30 95,70 C95,110 55,110 55,70 Z'],
  };
  const ds = paths[n] || paths[0];
  return ds;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

interface NumberTracingGameProps {
  step: any;
  onSuccess: () => void;
}

const CANVAS_PX = 360; // square render size

const NumberTracingGame: React.FC<NumberTracingGameProps> = ({ step, onSuccess }) => {
  const data = step.data || {};
  const number: number =
    data?.number?.value ??
    data?.number ??
    (typeof data?.ui?.instruction === 'string'
      ? parseInt((data.ui.instruction.match(/\d+/) || ['0'])[0], 10)
      : 0);

  const instruction = data?.ui?.instruction || `Trace the number ${number}`;
  const instructionAudio = step.instruction_audio_url || data?.assets?.audio_prompt;

  const pngUrl = getNumberPngUrl(number);
  const svgUrl = getNumberSvgUrl(number);

  const [pngOk, setPngOk] = useState(true);
  const [svgText, setSvgText] = useState<string | null>(null);
  const [pathInfo, setPathInfo] = useState<ReturnType<typeof extractPathData> | null>(null);

  const [strokes, setStrokes] = useState<{ x: number; y: number }[][]>([]);
  const [current, setCurrent] = useState<{ x: number; y: number }[]>([]);
  const [hitMask, setHitMask] = useState<boolean[]>([]);
  const [completed, setCompleted] = useState(false);
  const [deviated, setDeviated] = useState(false);
  const [showHand, setShowHand] = useState(true);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const sparkleId = useRef(0);
  const traceAudio = useRef<HTMLAudioElement | null>(null);

  /* ------- Load SVG (or fallback) ------- */
  useEffect(() => {
    let cancelled = false;
    setSvgText(null);
    setPathInfo(null);
    setStrokes([]);
    setCurrent([]);
    setCompleted(false);
    setDeviated(false);
    setShowHand(true);

    fetch(svgUrl)
      .then(r => (r.ok ? r.text() : Promise.reject(new Error('no svg'))))
      .then(t => {
        if (cancelled) return;
        setSvgText(t);
      })
      .catch(() => {
        if (cancelled) return;
        // Build fallback inline SVG
        const ds = fallbackForNumber(number);
        const fallback = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 140">${ds
          .map(d => `<path d="${d}" fill="none"/>`)
          .join('')}</svg>`;
        setSvgText(fallback);
      });

    return () => {
      cancelled = true;
    };
  }, [svgUrl, number]);

  /* ------- Parse SVG path ------- */
  useEffect(() => {
    if (!svgText) return;
    const info = extractPathData(svgText);
    setPathInfo(info);
    setHitMask(info ? new Array(info.checkpoints.length).fill(false) : []);
  }, [svgText]);

  /* ------- Play instruction audio ------- */
  useEffect(() => {
    if (!instructionAudio) return;
    try {
      const a = new Audio(getAssetUrl(instructionAudio));
      a.play().catch(() => {});
    } catch {}
  }, [instructionAudio]);

  /* ------- Soft "crayon" sound while tracing ------- */
  const playCrayon = useCallback(() => {
    try {
      if (!traceAudio.current) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.value = 220;
        g.gain.value = 0.02;
        o.connect(g).connect(ctx.destination);
        o.start();
        setTimeout(() => {
          o.stop();
          ctx.close();
        }, 90);
      }
    } catch {}
  }, []);

  /* ------- Coordinate conversion: canvas px -> svg viewBox ------- */
  const toSvgCoords = useCallback(
    (cx: number, cy: number) => {
      if (!pathInfo) return { x: cx, y: cy };
      const { viewBox } = pathInfo;
      return {
        x: viewBox.x + (cx / CANVAS_PX) * viewBox.w,
        y: viewBox.y + (cy / CANVAS_PX) * viewBox.h,
      };
    },
    [pathInfo],
  );

  const tolerance = useMemo(() => {
    if (!pathInfo) return 14;
    // Allow ~10% of viewBox diagonal as margin
    const diag = Math.hypot(pathInfo.viewBox.w, pathInfo.viewBox.h);
    return diag * 0.09;
  }, [pathInfo]);

  /* ------- Pointer handlers ------- */
  const getLocal = (e: React.PointerEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleDown = (e: React.PointerEvent) => {
    if (completed) return;
    setShowHand(false);
    const p = getLocal(e);
    setCurrent([p]);
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const handleMove = (e: React.PointerEvent) => {
    if (current.length === 0 || completed) return;
    const p = getLocal(e);
    const last = current[current.length - 1];
    if (dist(last, p) < 3) return;
    setCurrent(prev => [...prev, p]);

    // Mark nearby checkpoints as hit
    if (pathInfo) {
      const sp = toSvgCoords(p.x, p.y);
      let anyClose = false;
      let updated = false;
      const mask = hitMask.slice();
      for (let i = 0; i < pathInfo.checkpoints.length; i++) {
        const cp = pathInfo.checkpoints[i];
        const d = dist(sp, cp);
        if (d < tolerance) {
          anyClose = true;
          if (!mask[i]) {
            mask[i] = true;
            updated = true;
          }
        }
      }
      if (updated) setHitMask(mask);
      setDeviated(!anyClose);

      // Sparkle trail
      if (Math.random() > 0.55) {
        const id = ++sparkleId.current;
        setSparkles(prev => [...prev.slice(-12), { id, x: p.x, y: p.y }]);
        setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== id)), 700);
      }
      playCrayon();

      // Completion check
      const hits = mask.filter(Boolean).length;
      const ratio = hits / mask.length;
      if (ratio >= 0.85 && !completed) {
        setCompleted(true);
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          [523, 659, 784].forEach((f, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.frequency.value = f;
            o.type = 'sine';
            g.gain.value = 0.06;
            o.connect(g).connect(ctx.destination);
            o.start(ctx.currentTime + i * 0.12);
            o.stop(ctx.currentTime + i * 0.12 + 0.18);
          });
          setTimeout(() => ctx.close(), 700);
        } catch {}
      }
    }
  };

  const handleUp = (e: React.PointerEvent) => {
    if (current.length > 1) setStrokes(prev => [...prev, current]);
    setCurrent([]);
    setDeviated(false);
    try {
      containerRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
  };

  /* ------- Actions ------- */
  const handleRetry = () => {
    setStrokes([]);
    setCurrent([]);
    setHitMask(pathInfo ? new Array(pathInfo.checkpoints.length).fill(false) : []);
    setCompleted(false);
    setDeviated(false);
    setShowHand(true);
  };

  const handleNext = () => {
    if (completed) onSuccess();
  };

  /* ------- Render ------- */
  const vb = pathInfo?.viewBox || { x: 0, y: 0, w: 100, h: 140 };
  const progressRatio = hitMask.length ? hitMask.filter(Boolean).length / hitMask.length : 0;

  return (
    <div className="flex flex-col items-center gap-4 px-3 sm:px-6 w-full">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">Trace the Number</h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Follow the dotted line with your finger
        </p>
      </div>

      {/* Optional instruction bar (audio etc) */}
      {instruction && (
        <InstructionBar text={instruction} audioUrl={instructionAudio} />
      )}

      {/* Tracing area */}
      <motion.div
        ref={containerRef}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerLeave={handleUp}
        className={`relative rounded-3xl border-4 select-none overflow-hidden touch-none transition-colors ${
          completed
            ? 'border-funquest-success/60 shadow-[0_0_40px_rgba(34,197,94,0.35)]'
            : deviated
            ? 'border-funquest-error/50 shadow-[0_0_30px_rgba(239,68,68,0.25)]'
            : 'border-border/40 shadow-medium'
        }`}
        style={{
          width: CANVAS_PX,
          height: CANVAS_PX,
          maxWidth: '92vw',
          maxHeight: '92vw',
          background:
            'radial-gradient(circle at 50% 40%, hsl(var(--background)) 0%, hsl(var(--muted)/0.5) 100%)',
        }}
      >
        {/* PNG guide background */}
        {pngOk && (
          <img
            src={pngUrl}
            alt={`Number ${number}`}
            onError={() => setPngOk(false)}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ opacity: 0.4 }}
            draggable={false}
          />
        )}

        {/* SVG overlay: dotted guide + active fill */}
        {pathInfo && (
          <svg
            viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            {/* Glow filter */}
            <defs>
              <filter id="successGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Dotted base path */}
            {pathInfo.pathDs.map((d, i) => (
              <path
                key={`base-${i}`}
                d={d}
                fill="none"
                stroke="hsl(var(--muted-foreground) / 0.55)"
                strokeWidth={Math.max(2, vb.w * 0.04)}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={`${vb.w * 0.025} ${vb.w * 0.04}`}
              />
            ))}

            {/* Active progress overlay (dash offset based on ratio) */}
            {pathInfo.pathDs.map((d, i) => {
              const len = 1000; // estimate; harmless
              return (
                <path
                  key={`fill-${i}`}
                  d={d}
                  fill="none"
                  stroke={completed ? 'hsl(142 70% 45%)' : 'hsl(217 91% 60%)'}
                  strokeWidth={Math.max(2.5, vb.w * 0.05)}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={len}
                  strokeDashoffset={len - len * progressRatio}
                  style={{ transition: 'stroke-dashoffset 0.15s linear, stroke 0.3s' }}
                  filter={completed ? 'url(#successGlow)' : undefined}
                />
              );
            })}
          </svg>
        )}

        {/* User strokes overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" width={CANVAS_PX} height={CANVAS_PX}>
          {strokes.map((s, i) => (
            <polyline
              key={i}
              points={s.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="hsl(217 91% 55%)"
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.55}
            />
          ))}
          {current.length > 1 && (
            <polyline
              points={current.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="hsl(217 91% 55%)"
              strokeWidth={11}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.7}
            />
          )}
        </svg>

        {/* Sparkles */}
        <AnimatePresence>
          {sparkles.map(s => (
            <motion.div
              key={s.id}
              initial={{ opacity: 1, scale: 0.4 }}
              animate={{ opacity: 0, scale: 1.6, y: s.y - 14 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute pointer-events-none"
              style={{ left: s.x - 8, top: s.y - 8 }}
            >
              <Sparkles className="w-4 h-4 text-funquest-warning" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Hand guide (first attempt) */}
        {showHand && pathInfo && pathInfo.checkpoints.length > 1 && (
          <motion.div
            className="absolute pointer-events-none text-3xl"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: pathInfo.checkpoints.map(
                cp => ((cp.x - vb.x) / vb.w) * CANVAS_PX - 14,
              ),
              y: pathInfo.checkpoints.map(
                cp => ((cp.y - vb.y) / vb.h) * CANVAS_PX - 8,
              ),
            }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
          >
            👆
          </motion.div>
        )}

        {/* Success glow text */}
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 bottom-3 flex justify-center"
            >
              <div className="bg-funquest-success/15 border border-funquest-success/40 text-funquest-success font-bold rounded-full px-5 py-2 shadow-medium">
                Great job! 🌟
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress hint */}
      <div className="w-full max-w-[360px]">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${completed ? 'bg-funquest-success' : 'bg-funquest-blue'}`}
            initial={false}
            animate={{ width: `${Math.round(progressRatio * 100)}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 mt-1">
        <Button
          variant="outline"
          onClick={handleRetry}
          className="rounded-full px-5 border-2 font-semibold gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
        <Button
          onClick={handleNext}
          disabled={!completed}
          className="rounded-full px-6 font-semibold gap-2 shadow-medium disabled:opacity-50"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default NumberTracingGame;
