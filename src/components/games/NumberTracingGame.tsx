import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw, ArrowRight, Sparkles, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

/* ------------------------------------------------------------------ */
/* Asset helpers                                                       */
/* ------------------------------------------------------------------ */

const BUCKET = 'game assets';

function publicUrl(path: string) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
const pngUrlFor = (n: number) => publicUrl(`Tracing/png/${n}.png`);
const svgUrlFor = (n: number) => publicUrl(`Tracing/svg/${n}.svg`);

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

/** Parse an SVG, sample its paths/lines/polylines into checkpoints in viewBox coords. */
function parseSvgPaths(svgText: string) {
  try {
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) return null;

    let viewBox = { x: 0, y: 0, w: 1024, h: 1024 };
    const vb = svg.getAttribute('viewBox');
    if (vb) {
      const p = vb.split(/[\s,]+/).map(Number);
      if (p.length === 4) viewBox = { x: p[0], y: p[1], w: p[2], h: p[3] };
    }

    // Convert primitives -> path "d" strings
    const ds: string[] = [];
    svg.querySelectorAll('path').forEach(p => {
      const d = p.getAttribute('d');
      if (d) ds.push(d);
    });
    svg.querySelectorAll('line').forEach(l => {
      const x1 = l.getAttribute('x1'), y1 = l.getAttribute('y1');
      const x2 = l.getAttribute('x2'), y2 = l.getAttribute('y2');
      if (x1 && y1 && x2 && y2) ds.push(`M${x1},${y1} L${x2},${y2}`);
    });
    svg.querySelectorAll('polyline,polygon').forEach(pl => {
      const pts = pl.getAttribute('points');
      if (pts) {
        const cleaned = pts.trim().split(/\s+/).join(' L');
        ds.push(`M${cleaned}`);
      }
    });
    if (!ds.length) return null;

    // Sample using a temp SVG
    const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tmp.setAttribute('style', 'position:absolute;width:0;height:0;visibility:hidden');
    document.body.appendChild(tmp);

    const checkpoints: { x: number; y: number }[] = [];
    let totalLen = 0;
    ds.forEach(d => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      tmp.appendChild(path);
      const len = path.getTotalLength();
      if (!len || !isFinite(len)) return;
      totalLen += len;
      const samples = Math.max(40, Math.min(240, Math.round(len / 12)));
      for (let i = 0; i <= samples; i++) {
        const pt = path.getPointAtLength((i / samples) * len);
        checkpoints.push({ x: pt.x, y: pt.y });
      }
    });
    document.body.removeChild(tmp);

    if (!checkpoints.length) return null;
    return { viewBox, ds, checkpoints, totalLen };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Audio helpers                                                       */
/* ------------------------------------------------------------------ */

const playTone = (freq: number, duration = 0.12, type: OscillatorType = 'sine', vol = 0.05) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + duration);
    setTimeout(() => ctx.close(), duration * 1000 + 200);
  } catch {}
};

const playSuccessChime = () => {
  [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => playTone(f, 0.18, 'sine', 0.07), i * 110));
};

const speak = (text: string) => {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.pitch = 1.15;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {}
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

interface Props {
  step?: any;
  onSuccess?: () => void;
}

const CANVAS = 520;       // outer card render size
const PAD = 36;           // inner padding so PNG/SVG don't touch edges
const COMPLETE_THRESHOLD = 0.82;

const NumberTracingGame: React.FC<Props> = ({ step, onSuccess }) => {
  /* ----- Discover available numbers (probe HEAD on PNG + SVG) ----- */
  const [available, setAvailable] = useState<number[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const candidates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    Promise.all(
      candidates.map(async n => {
        try {
          const [png, svg] = await Promise.all([
            fetch(pngUrlFor(n), { method: 'HEAD' }),
            fetch(svgUrlFor(n), { method: 'HEAD' }),
          ]);
          return png.ok && svg.ok ? n : null;
        } catch {
          return null;
        }
      }),
    ).then(results => {
      if (cancelled) return;
      const found = results.filter((n): n is number => n !== null);
      // If a step provided a specific number, prioritize starting there
      const stepNum =
        step?.data?.number?.value ?? step?.data?.number ?? null;
      if (typeof stepNum === 'number' && found.includes(stepNum)) {
        const reordered = [stepNum, ...found.filter(n => n !== stepNum)];
        setAvailable(reordered);
      } else {
        setAvailable(found.length ? found : []);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [step]);

  const [index, setIndex] = useState(0);
  const number = available?.[index] ?? null;

  /* ----- Per-number SVG load + parse ----- */
  const [pathInfo, setPathInfo] = useState<ReturnType<typeof parseSvgPaths> | null>(null);
  const [pngOk, setPngOk] = useState(true);
  const [strokes, setStrokes] = useState<{ x: number; y: number }[][]>([]);
  const [current, setCurrent] = useState<{ x: number; y: number }[]>([]);
  const [hits, setHits] = useState<boolean[]>([]);
  const [completed, setCompleted] = useState(false);
  const [showHand, setShowHand] = useState(true);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const sparkleId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (number == null) return;
    let cancelled = false;
    setPathInfo(null);
    setStrokes([]);
    setCurrent([]);
    setHits([]);
    setCompleted(false);
    setShowHand(true);
    setPngOk(true);

    fetch(svgUrlFor(number))
      .then(r => (r.ok ? r.text() : Promise.reject()))
      .then(t => {
        if (cancelled) return;
        const info = parseSvgPaths(t);
        setPathInfo(info);
        setHits(info ? new Array(info.checkpoints.length).fill(false) : []);
      })
      .catch(() => {});

    // Voice prompt
    setTimeout(() => speak(`Trace the number ${number}`), 250);
    return () => {
      cancelled = true;
    };
  }, [number]);

  /* ----- Coordinate conversion ----- */
  const toSvg = useCallback(
    (cx: number, cy: number) => {
      if (!pathInfo) return { x: cx, y: cy };
      const inner = CANVAS - PAD * 2;
      return {
        x: pathInfo.viewBox.x + ((cx - PAD) / inner) * pathInfo.viewBox.w,
        y: pathInfo.viewBox.y + ((cy - PAD) / inner) * pathInfo.viewBox.h,
      };
    },
    [pathInfo],
  );

  const fromSvg = useCallback(
    (sx: number, sy: number) => {
      if (!pathInfo) return { x: sx, y: sy };
      const inner = CANVAS - PAD * 2;
      return {
        x: PAD + ((sx - pathInfo.viewBox.x) / pathInfo.viewBox.w) * inner,
        y: PAD + ((sy - pathInfo.viewBox.y) / pathInfo.viewBox.h) * inner,
      };
    },
    [pathInfo],
  );

  const tolerance = useMemo(() => {
    if (!pathInfo) return 80;
    return Math.hypot(pathInfo.viewBox.w, pathInfo.viewBox.h) * 0.07;
  }, [pathInfo]);

  /* ----- Pointer handlers ----- */
  const local = (e: React.PointerEvent) => {
    const r = containerRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * CANVAS,
      y: ((e.clientY - r.top) / r.height) * CANVAS,
    };
  };

  const onDown = (e: React.PointerEvent) => {
    if (completed) return;
    setShowHand(false);
    const p = local(e);
    setCurrent([p]);
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!current.length || completed || !pathInfo) return;
    const p = local(e);
    if (dist(p, current[current.length - 1]) < 4) return;
    setCurrent(prev => [...prev, p]);

    const sp = toSvg(p.x, p.y);
    const mask = hits.slice();
    let updated = false;
    for (let i = 0; i < pathInfo.checkpoints.length; i++) {
      if (!mask[i] && dist(sp, pathInfo.checkpoints[i]) < tolerance) {
        mask[i] = true;
        updated = true;
      }
    }
    if (updated) setHits(mask);

    if (Math.random() > 0.55) {
      const id = ++sparkleId.current;
      setSparkles(prev => [...prev.slice(-10), { id, x: p.x, y: p.y }]);
      setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== id)), 700);
    }
    if (Math.random() > 0.7) playTone(220 + Math.random() * 60, 0.04, 'triangle', 0.015);

    const ratio = mask.filter(Boolean).length / mask.length;
    if (ratio >= COMPLETE_THRESHOLD && !completed) {
      setCompleted(true);
      playSuccessChime();
    }
  };

  const onUp = (e: React.PointerEvent) => {
    if (current.length > 1) setStrokes(prev => [...prev, current]);
    setCurrent([]);
    try {
      containerRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
  };

  /* ----- Actions ----- */
  const handleRetry = () => {
    setStrokes([]);
    setCurrent([]);
    setHits(pathInfo ? new Array(pathInfo.checkpoints.length).fill(false) : []);
    setCompleted(false);
    setShowHand(true);
  };

  const goNext = () => {
    if (!available) return;
    if (index < available.length - 1) {
      setIndex(i => i + 1);
    } else {
      onSuccess?.();
    }
  };

  const goPrev = () => {
    if (index > 0) setIndex(i => i - 1);
  };

  /* ----- Loading state ----- */
  if (available === null) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-14 h-14 rounded-full border-4 border-funquest-blue/30 border-t-funquest-blue animate-spin" />
        <p className="text-muted-foreground font-medium">Loading tracing numbers…</p>
      </div>
    );
  }

  if (available.length === 0 || number == null) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-5xl">😕</span>
        <p className="text-foreground font-semibold">No tracing numbers available yet.</p>
      </div>
    );
  }

  /* ----- Derived for render ----- */
  const vb = pathInfo?.viewBox || { x: 0, y: 0, w: 1024, h: 1024 };
  const progressRatio = hits.length ? hits.filter(Boolean).length / hits.length : 0;
  const startPt = pathInfo?.checkpoints[0];
  const arrowFromTo =
    pathInfo && pathInfo.checkpoints.length > 6
      ? { from: pathInfo.checkpoints[0], to: pathInfo.checkpoints[8] }
      : null;

  return (
    <div className="flex flex-col items-center gap-5 px-3 sm:px-6 w-full">
      {/* Title row */}
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Trace the Number{' '}
          <span className="text-funquest-blue">{number}</span>
        </h2>
        <p className="text-sm text-muted-foreground">Follow the dotted path with your finger</p>
      </div>

      {/* Number selector chips */}
      <div className="flex items-center gap-2 flex-wrap justify-center max-w-[520px]">
        {available.map((n, i) => (
          <button
            key={n}
            onClick={() => setIndex(i)}
            className={`w-9 h-9 rounded-full text-sm font-bold border-2 transition-all ${
              i === index
                ? 'bg-funquest-blue text-white border-funquest-blue scale-110 shadow-medium'
                : i < index
                ? 'bg-funquest-success/15 text-funquest-success border-funquest-success/40'
                : 'bg-card text-muted-foreground border-border/60 hover:border-funquest-blue/50'
            }`}
            aria-label={`Number ${n}`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Tracing card */}
      <motion.div
        ref={containerRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className={`relative select-none touch-none transition-all ${
          completed
            ? 'ring-4 ring-funquest-success/50 shadow-[0_0_50px_rgba(34,197,94,0.35)]'
            : 'shadow-large'
        }`}
        style={{
          width: CANVAS,
          height: CANVAS,
          maxWidth: '92vw',
          maxHeight: '92vw',
          aspectRatio: '1 / 1',
          borderRadius: 36,
          background:
            'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(210 40% 98%) 100%)',
          border: '3px solid hsl(var(--border) / 0.6)',
          padding: PAD,
        }}
      >
        {/* PNG: visible artwork */}
        <div className="relative w-full h-full">
          {pngOk && (
            <img
              src={pngUrlFor(number)}
              alt={`Number ${number}`}
              onError={() => setPngOk(false)}
              draggable={false}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                objectFit: 'contain',
                width: '78%',
                height: '78%',
                left: '11%',
                top: '11%',
              }}
            />
          )}

          {/* SVG: invisible-tracking path with subtle dotted guide overlay */}
          {pathInfo && (
            <svg
              viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <defs>
                <linearGradient id="traceGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(217 91% 60%)" />
                  <stop offset="100%" stopColor="hsl(280 80% 60%)" />
                </linearGradient>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Dotted guide path (thin, light) */}
              {pathInfo.ds.map((d, i) => (
                <path
                  key={`g-${i}`}
                  d={d}
                  fill="none"
                  stroke="hsl(217 91% 60% / 0.55)"
                  strokeWidth={Math.max(6, vb.w * 0.012)}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={`${vb.w * 0.012} ${vb.w * 0.028}`}
                />
              ))}

              {/* Animated progress overlay (glowing reveal) */}
              {pathInfo.ds.map((d, i) => {
                const len = 4000;
                return (
                  <path
                    key={`p-${i}`}
                    d={d}
                    fill="none"
                    stroke={completed ? 'hsl(142 70% 45%)' : 'url(#traceGrad)'}
                    strokeWidth={Math.max(10, vb.w * 0.022)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={len}
                    strokeDashoffset={len - len * progressRatio}
                    style={{ transition: 'stroke-dashoffset 0.18s linear, stroke 0.3s' }}
                    filter="url(#glow)"
                    opacity={0.85}
                  />
                );
              })}

              {/* Start dot (green) */}
              {startPt && !completed && (
                <g>
                  <circle
                    cx={startPt.x}
                    cy={startPt.y}
                    r={vb.w * 0.028}
                    fill="hsl(142 70% 45%)"
                    opacity={0.25}
                  >
                    <animate
                      attributeName="r"
                      values={`${vb.w * 0.028};${vb.w * 0.05};${vb.w * 0.028}`}
                      dur="1.6s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx={startPt.x}
                    cy={startPt.y}
                    r={vb.w * 0.022}
                    fill="hsl(142 70% 45%)"
                  />
                  <text
                    x={startPt.x}
                    y={startPt.y + vb.w * 0.008}
                    textAnchor="middle"
                    fontSize={vb.w * 0.028}
                    fontWeight="bold"
                    fill="white"
                  >
                    ▶
                  </text>
                </g>
              )}

              {/* Directional arrow */}
              {arrowFromTo && progressRatio < 0.1 && (
                <g opacity={0.7}>
                  <line
                    x1={arrowFromTo.from.x}
                    y1={arrowFromTo.from.y}
                    x2={arrowFromTo.to.x}
                    y2={arrowFromTo.to.y}
                    stroke="hsl(217 91% 50%)"
                    strokeWidth={vb.w * 0.008}
                    strokeDasharray={`${vb.w * 0.02} ${vb.w * 0.015}`}
                  />
                </g>
              )}
            </svg>
          )}

          {/* User stroke overlay (in canvas pixel space) */}
          <svg
            className="absolute pointer-events-none"
            viewBox={`0 0 ${CANVAS} ${CANVAS}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ inset: -PAD, width: CANVAS, height: CANVAS }}
          >
            {strokes.concat(current.length > 1 ? [current] : []).map((s, i) => (
              <polyline
                key={i}
                points={s.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="hsl(217 91% 55%)"
                strokeWidth={14}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.55}
              />
            ))}
          </svg>
        </div>

        {/* Sparkle trail */}
        <AnimatePresence>
          {sparkles.map(s => (
            <motion.div
              key={s.id}
              initial={{ opacity: 1, scale: 0.4 }}
              animate={{ opacity: 0, scale: 1.6, y: -16 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute pointer-events-none"
              style={{ left: s.x - 10, top: s.y - 10 }}
            >
              <Sparkles className="w-5 h-5 text-funquest-warning" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Hand guide (first attempt) */}
        {showHand && pathInfo && pathInfo.checkpoints.length > 8 && (
          <motion.div
            className="absolute pointer-events-none text-3xl select-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: pathInfo.checkpoints
                .filter((_, i) => i % Math.ceil(pathInfo.checkpoints.length / 30) === 0)
                .map(cp => fromSvg(cp.x, cp.y).x - 12),
              y: pathInfo.checkpoints
                .filter((_, i) => i % Math.ceil(pathInfo.checkpoints.length / 30) === 0)
                .map(cp => fromSvg(cp.x, cp.y).y - 6),
            }}
            transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
          >
            👆
          </motion.div>
        )}

        {/* Success badge */}
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 bottom-4 flex justify-center"
            >
              <div className="bg-funquest-success text-white font-bold rounded-full px-6 py-2.5 shadow-large flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Great Job!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full max-w-[400px]">
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              completed ? 'bg-funquest-success' : 'bg-gradient-to-r from-funquest-blue to-funquest-purple'
            }`}
            initial={false}
            animate={{ width: `${Math.round(progressRatio * 100)}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
        <Button
          variant="outline"
          size="icon"
          onClick={goPrev}
          disabled={index === 0}
          className="rounded-full w-11 h-11 border-2"
          aria-label="Previous number"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          onClick={handleRetry}
          className="rounded-full px-5 h-11 border-2 font-semibold gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => speak(`Trace the number ${number}`)}
          className="rounded-full w-11 h-11 border-2"
          aria-label="Hear instruction"
        >
          <Volume2 className="w-5 h-5" />
        </Button>

        <Button
          onClick={goNext}
          disabled={!completed}
          className="rounded-full px-6 h-11 font-semibold gap-2 shadow-medium disabled:opacity-50 bg-gradient-to-r from-funquest-blue to-funquest-purple text-white hover:opacity-90"
        >
          {index < (available.length - 1) ? 'Next' : 'Finish'}
          <ArrowRight className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => available && index < available.length - 1 && setIndex(i => i + 1)}
          disabled={index >= available.length - 1}
          className="rounded-full w-11 h-11 border-2"
          aria-label="Skip"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default NumberTracingGame;
