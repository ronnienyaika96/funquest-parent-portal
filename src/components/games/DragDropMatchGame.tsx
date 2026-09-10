import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragCancelEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { getAssetUrl } from '@/pages/PlayActivityPage';
import { getChoiceAssetByState, getDropZoneAssetUrl } from '@/lib/gameAssets';
import { getLetterAsset } from '@/lib/letterAssets';
import { getNumberAsset } from '@/lib/numberAssets';
import { getGameAssetUrl } from '@/lib/funquest-assets';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RotateCcw, ArrowRight, Volume2, ArrowDown, Lightbulb, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGameAudio } from '@/hooks/useGameAudio';
import FeedbackOverlay from './FeedbackOverlay';

interface DraggableData {
  id: string;
  label: string;
  image?: string;
}

interface Target {
  id: string;
  label: string;
  image?: string;
  accepts: string[];
  /** Quantity-image mode: how many object images to render */
  quantity?: number;
  /** Quantity-image mode: object pool name (e.g. "apple") */
  objectName?: string;
}

// Supabase public URL for object images (bucket "game assets" → folder "Objects")
const SUPABASE_PUBLIC_URL = 'https://edjtsiynyhrnulfgwbkf.supabase.co';
const getObjectImageUrl = (name: string) =>
  `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/game%20assets/Objects/${name}.png`;

const OBJECT_POOL = [
  'apple','ball','cat','dog','elephant','fish','giraffe','house','insect','jug',
  'kite','lemon','mango','nail','orange','pencil','pumpkin','queen','rat','sun','turtle',
];

/**
 * Map a–z to actual filenames in the Supabase "game assets" → "Objects/" folder.
 * (Some files have intentional typos in storage: xylephone, yatch.)
 */
const LETTER_TO_OBJECT: Record<string, string> = {
  a: 'apple', b: 'ball', c: 'cat', d: 'dog', e: 'elephant', f: 'fish',
  g: 'giraffe', h: 'house', i: 'insect', j: 'jug', k: 'kite', l: 'lemon',
  m: 'mango', n: 'nest', o: 'orange', p: 'pencil', q: 'queen', r: 'rat',
  s: 'sun', t: 'turtle', u: 'umbrella', v: 'van', w: 'watermelon',
  x: 'xylephone', y: 'yatch', z: 'zebra',
};

/** For a picture-match target, derive the storage filename from the accepted draggable id (e.g. "drag_a"). */
function resolveTargetObjectName(target: Target): string | null {
  for (const id of target.accepts || []) {
    const m = String(id).match(/([a-zA-Z])\s*$/);
    if (m) {
      const letter = m[1].toLowerCase();
      if (LETTER_TO_OBJECT[letter]) return LETTER_TO_OBJECT[letter];
    }
  }
  // Fallback: try the label's first word lowercased (e.g. "apple", "ice cream" → "icecream")
  const labelKey = (target.label || '').toLowerCase().replace(/\s+/g, '');
  return labelKey || null;
}

const shuffleArr = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const pluralize = (word: string, n: number) => {
  if (n === 1) return word;
  if (/(s|x|z|ch|sh)$/i.test(word)) return `${word}es`;
  if (/[^aeiou]y$/i.test(word)) return `${word.slice(0, -1)}ies`;
  return `${word}s`;
};

interface DragDropMatchGameProps {
  step: any;
  onSuccess: () => void;
}

/** Try to resolve a label to a Supabase letter/number SVG asset. */
function resolveContentAsset(label: string): string | null {
  // Check if it's a single letter
  if (/^[a-zA-Z]$/.test(label)) {
    const url = getLetterAsset(label);
    if (url) return url;
  }
  // Check if it's a number 1-10
  const num = parseInt(label, 10);
  if (!isNaN(num) && num >= 1 && num <= 10) {
    const url = getNumberAsset(num);
    if (url) return url;
  }
  return null;
}

function DraggableItem({ item, isMatched, isDragging }: {
  item: DraggableData; isMatched: boolean; isDragging: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });
  const draggableBg = getChoiceAssetByState('default');
  const contentAsset = resolveContentAsset(item.label);

  const style: React.CSSProperties = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.3 : isMatched ? 0.5 : 1,
    touchAction: 'none',
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      whileHover={!isMatched ? { scale: 1.08 } : {}}
      whileTap={!isMatched ? { scale: 0.95 } : {}}
      className={`relative aspect-square flex items-center justify-center cursor-grab active:cursor-grabbing select-none
        ${isMatched ? 'pointer-events-none' : ''}
      `}
    >
      {/* SVG tile background */}
      <img
        src={draggableBg}
        alt=""
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center w-[65%] h-[65%]">
        {item.image ? (
          <img
            src={getAssetUrl(item.image)}
            alt={item.label}
            className="w-full h-full object-contain drop-shadow-md pointer-events-none"
          />
        ) : contentAsset ? (
          <img
            src={contentAsset}
            alt={item.label}
            className="w-full h-full object-contain drop-shadow-md pointer-events-none"
          />
        ) : (
          <span
            className="font-extrabold pointer-events-none drop-shadow-sm"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              color: '#3B82F6',
              fontFamily: "'Nunito', 'Comic Sans MS', cursive, sans-serif",
            }}
          >
            {item.label}
          </span>
        )}
      </div>

      {isMatched && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 z-20"
        >
          <CheckCircle className="w-7 h-7 text-emerald-500 drop-shadow" />
        </motion.div>
      )}
    </motion.div>
  );
}

/** Phone-only tactile letter tile. The SVG is intentionally larger than the desktop version. */
function MobileLetterTile({ item, isMatched, isDragging }: {
  item: DraggableData; isMatched: boolean; isDragging: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });
  const contentAsset = resolveContentAsset(item.label);
  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.28 : isMatched ? 0.42 : 1,
    touchAction: 'none',
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      animate={isMatched ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      whileTap={!isMatched ? { scale: 1.06, y: -3 } : undefined}
      className={`mobile-letter-tile ${isMatched ? 'pointer-events-none' : ''}`}
    >
      {item.image ? (
        <img src={getAssetUrl(item.image)} alt={item.label} className="mobile-letter-art" />
      ) : contentAsset ? (
        <img src={contentAsset} alt={item.label} className="mobile-letter-art" />
      ) : (
        <span className="mobile-letter-fallback">{item.label}</span>
      )}
      {isMatched && (
        <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} className="absolute -right-1 -top-1">
          <CheckCircle className="h-7 w-7 fill-card text-funquest-success drop-shadow" />
        </motion.div>
      )}
    </motion.div>
  );
}

/** Phone-only picture target with a fixed image stage and label position. */
function MobilePictureCard({ target, matched, wrong }: {
  target: Target; matched: boolean; wrong: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: target.id });
  const objectName = resolveTargetObjectName(target);
  const primarySrc = objectName ? getObjectImageUrl(objectName) : (target.image ? getAssetUrl(target.image) : '');

  return (
    <motion.div
      ref={setNodeRef}
      animate={wrong
        ? { x: [0, -7, 7, -4, 4, 0] }
        : matched
          ? { scale: [1, 1.05, 1] }
          : isOver ? { scale: 1.025 } : { scale: 1 }}
      transition={wrong ? { duration: 0.42 } : { type: 'spring', stiffness: 280, damping: 16 }}
      className={`mobile-picture-card ${matched ? 'mobile-picture-card--matched' : ''} ${isOver ? 'mobile-picture-card--over' : ''}`}
    >
      <div className="mobile-picture-stage">
        {primarySrc && (
          <img
            src={primarySrc}
            alt={target.label}
            className="mobile-picture-art"
            onError={(event) => {
              const image = event.currentTarget;
              if (target.image && image.src !== getAssetUrl(target.image)) image.src = getAssetUrl(target.image);
              else image.style.display = 'none';
            }}
          />
        )}
      </div>
      <div className="mobile-picture-label">{target.label}</div>
      {matched && (
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -25 }}
          animate={{ opacity: 1, scale: [0, 1.25, 1], rotate: 0 }}
          className="absolute right-2 top-2"
        >
          <Sparkles className="h-7 w-7 text-funquest-warning drop-shadow" />
        </motion.div>
      )}
    </motion.div>
  );
}

function DroppableTarget({ target, matchedItem }: {
  target: Target; matchedItem: DraggableData | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: target.id });
  const dropBg = getDropZoneAssetUrl(!!matchedItem);

  const getImageSize = (count: number) => {
    if (count <= 4) return 'w-20 h-20';
    if (count <= 6) return 'w-16 h-16';
    return 'w-14 h-14';
  };

  const isQuantityMode = !!(target.objectName && target.quantity);

  return (
    <motion.div
      ref={setNodeRef}
      animate={isOver ? { scale: 1.06 } : { scale: 1 }}
      className={
        isQuantityMode
          ? 'relative bg-white/80 rounded-2xl p-6 min-h-[220px] flex flex-col items-center justify-center shadow-md text-center'
          : 'relative aspect-square flex flex-col items-center justify-center'
      }
    >
      {/* SVG drop zone background (non-quantity mode only) */}
      {!isQuantityMode && (
        <img
          src={dropBg}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      )}

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center text-center ${isQuantityMode ? 'w-full' : 'absolute inset-0 w-full h-full gap-2 p-4'}`}>
        {isQuantityMode ? (
          <div className="flex flex-wrap justify-center items-center gap-3 mb-3 max-w-[200px]">
            {Array.from({ length: target.quantity! }).map((_, i) => (
              <motion.img
                key={i}
                src={getObjectImageUrl(target.objectName!)}
                alt={target.objectName}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 220, damping: 14 }}
                className={`${getImageSize(target.quantity!)} object-contain drop-shadow-md hover:scale-105 transition-transform duration-200`}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            ))}
          </div>
        ) : (() => {
          const objName = resolveTargetObjectName(target);
          const primarySrc = objName ? getObjectImageUrl(objName) : (target.image ? getAssetUrl(target.image) : '');
          if (!primarySrc) return null;
          return (
            <img
              src={primarySrc}
              alt={target.label}
              className="w-[70%] h-[55%] max-w-[150px] max-h-[150px] object-contain drop-shadow-md mx-auto my-auto"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (target.image && img.src !== getAssetUrl(target.image)) {
                  img.src = getAssetUrl(target.image);
                } else {
                  img.style.display = 'none';
                }
              }}
            />
          );
        })()}
        {/* Label */}
        <div
          className={`rounded-lg px-3 py-1 text-center ${isQuantityMode ? 'mt-2' : ''}`}
          style={{
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(148,163,184,0.3)',
          }}
        >
          <span
            className="font-medium text-sm sm:text-base"
            style={{
              color: '#334155',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            {target.label}
          </span>
        </div>

        {matchedItem && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          >
            <CheckCircle className="w-6 h-6 text-emerald-500 drop-shadow" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/** Columns used to lay out N objects in a balanced grid (per design spec). */
function gridColsForQuantity(n: number): number {
  switch (n) {
    case 1: return 1;
    case 2: return 2;
    case 3: return 3;
    case 4: return 2;
    case 5: return 3;
    case 6: return 3;
    case 7: return 4;
    case 8: return 4;
    case 9: return 3;
    case 10: return 5;
    default: return Math.min(5, Math.ceil(Math.sqrt(n)));
  }
}

function objectSizeForQuantity(n: number): number {
  if (n <= 4) return 64;
  if (n <= 6) return 58;
  if (n <= 8) return 52;
  return 46;
}

const LABEL_TONES = [
  { bg: '#DCFCE7', text: '#15803D', border: 'rgba(34,197,94,0.35)' },
  { bg: '#FEF3C7', text: '#B45309', border: 'rgba(245,158,11,0.35)' },
  { bg: '#DBEAFE', text: '#1D4ED8', border: 'rgba(59,130,246,0.35)' },
  { bg: '#FCE7F3', text: '#BE185D', border: 'rgba(236,72,153,0.35)' },
];

/** Mobile-first draggable number tile (dashed light card + big colorful digit). */
function NumberTile({ item, matched, dragging, color }: {
  item: DraggableData; matched: boolean; dragging: boolean; color: string;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });
  const numAsset = resolveContentAsset(item.label);

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      whileTap={!matched ? { scale: 0.94 } : {}}
      style={{
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        touchAction: 'none',
        width: 'clamp(96px, 28vw, 120px)',
        height: 'clamp(96px, 28vw, 120px)',
        borderRadius: 24,
        background: 'rgba(255,255,255,0.95)',
        border: '3px dashed rgba(96,165,250,0.55)',
        boxShadow: '0 10px 22px -10px rgba(30,64,175,0.45)',
        opacity: dragging ? 0.35 : matched ? 0.45 : 1,
      }}
      className={`relative flex items-center justify-center select-none cursor-grab active:cursor-grabbing ${matched ? 'pointer-events-none' : ''}`}
    >
      {numAsset ? (
        <img
          src={numAsset}
          alt={item.label}
          className="object-contain pointer-events-none"
          style={{ width: '68%', height: '68%' }}
        />
      ) : (
        <span
          className="pointer-events-none"
          style={{
            fontSize: 'clamp(3rem, 13vw, 4.25rem)',
            fontWeight: 900,
            color,
            WebkitTextStroke: '3px white',
            paintOrder: 'stroke fill',
            fontFamily: "'Nunito', sans-serif",
            lineHeight: 1,
          }}
        >
          {item.label}
        </span>
      )}
      {matched && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2">
          <CheckCircle className="w-7 h-7 text-emerald-500 fill-white drop-shadow" />
        </motion.div>
      )}
    </motion.div>
  );
}

/** Mobile object card: balanced object grid + pill label. Acts as a drop target. */
function ObjectCard({ target, matched, tone }: {
  target: Target; matched: boolean; tone: typeof LABEL_TONES[number];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: target.id });
  const n = target.quantity || 0;
  const objectName = target.objectName || 'apple';
  const cols = gridColsForQuantity(n);
  const size = objectSizeForQuantity(n);

  return (
    <motion.div
      ref={setNodeRef}
      animate={isOver ? { scale: 1.02 } : { scale: 1 }}
      className="relative w-full flex flex-col items-center justify-center"
      style={{
        borderRadius: 26,
        background: matched ? 'linear-gradient(135deg,#DCFCE7,#BBF7D0)' : '#FBFBF7',
        border: matched
          ? '3px solid #22c55e'
          : isOver
          ? '3px dashed #38bdf8'
          : '2px solid rgba(148,163,184,0.28)',
        boxShadow: matched
          ? '0 0 0 6px rgba(34,197,94,0.16), 0 14px 30px -14px rgba(34,197,94,0.5)'
          : '0 12px 26px -14px rgba(30,64,175,0.35)',
        padding: '16px 14px 14px',
        minHeight: 170,
        transition: 'background .25s, border-color .25s, box-shadow .25s',
      }}
    >
      <div
        className="grid mx-auto"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: 8,
          justifyItems: 'center',
          alignItems: 'center',
        }}
      >
        {Array.from({ length: n }).map((_, i) => (
          <motion.img
            key={i}
            src={getObjectImageUrl(objectName)}
            alt={objectName}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 220, damping: 14 }}
            className="drop-shadow-md"
            style={{ width: size, height: size, objectFit: 'contain' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        ))}
      </div>

      <div
        className="rounded-full px-5 py-1.5 mt-3"
        style={{
          background: matched ? '#22c55e' : tone.bg,
          color: matched ? 'white' : tone.text,
          border: `1.5px solid ${matched ? 'transparent' : tone.border}`,
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 800,
          fontSize: '1.05rem',
          whiteSpace: 'nowrap',
        }}
      >
        {target.label}
      </div>

      {matched && (
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute -top-3 -right-3"
        >
          <CheckCircle className="w-9 h-9 text-emerald-500 drop-shadow-lg fill-white" />
        </motion.div>
      )}
    </motion.div>
  );
}

/** Desktop-only large square number tile (150–180px). */
function DesktopNumberTile({ item, matched, dragging, color }: {
  item: DraggableData; matched: boolean; dragging: boolean; color: string;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });
  const numAsset = resolveContentAsset(item.label);

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      whileHover={!matched ? { scale: 1.05, y: -3 } : undefined}
      whileTap={!matched ? { scale: 0.96 } : undefined}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        touchAction: 'none',
        width: 'clamp(150px, 12vw, 180px)',
        height: 'clamp(150px, 12vw, 180px)',
        borderRadius: 28,
        background: 'rgba(255,255,255,0.96)',
        border: `4px solid ${matched ? '#22c55e' : 'rgba(147,197,253,0.85)'}`,
        boxShadow: '0 18px 32px -18px rgba(30,64,175,0.65)',
        opacity: dragging ? 0.35 : matched ? 0.5 : 1,
      }}
      className={`relative flex flex-shrink-0 items-center justify-center select-none cursor-grab active:cursor-grabbing ${matched ? 'pointer-events-none' : ''}`}
    >
      {numAsset ? (
        <img src={numAsset} alt={item.label} className="pointer-events-none object-contain" style={{ width: '70%', height: '70%' }} />
      ) : (
        <span
          className="pointer-events-none"
          style={{
            fontSize: '5rem', fontWeight: 900, color,
            WebkitTextStroke: '3px white', paintOrder: 'stroke fill',
            fontFamily: "'Nunito', sans-serif", lineHeight: 1,
          }}
        >
          {item.label}
        </span>
      )}
      {matched && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-3 -right-3">
          <CheckCircle className="w-9 h-9 text-emerald-500 fill-white drop-shadow" />
        </motion.div>
      )}
    </motion.div>
  );
}

/** Desktop-only fixed-size object drop card with a quantity-aware grid. */
function DesktopObjectCard({ target, matched, isWrong, tone }: {
  target: Target; matched: boolean; isWrong: boolean; tone: typeof LABEL_TONES[number];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: target.id });
  const n = target.quantity || 0;
  const objectName = target.objectName || 'apple';
  const cols = gridColsForQuantity(n);
  const rows = Math.ceil(n / cols);
  const size = rows >= 3 ? 52 : n >= 8 ? 62 : n >= 5 ? 70 : 82;

  return (
    <motion.div
      ref={setNodeRef}
      animate={isWrong ? { x: [0, -8, 8, -4, 4, 0] } : matched ? { scale: [1, 1.03, 1] } : isOver ? { scale: 1.02 } : { scale: 1 }}
      transition={isWrong ? { duration: 0.4 } : { type: 'spring', stiffness: 260, damping: 18 }}
      className="relative flex flex-col items-center justify-center flex-shrink-0"
      style={{
        width: 'clamp(420px, 34vw, 540px)',
        height: 240,
        borderRadius: 28,
        background: matched ? 'linear-gradient(135deg,#DCFCE7,#BBF7D0)' : 'rgba(255,255,255,0.9)',
        border: matched ? '3px solid #22c55e' : isOver ? '3px dashed #38bdf8' : '3px dashed rgba(148,163,184,0.55)',
        boxShadow: matched
          ? '0 0 0 6px rgba(34,197,94,0.16), 0 18px 34px -18px rgba(34,197,94,0.55)'
          : '0 18px 34px -20px rgba(30,64,175,0.5)',
        padding: '14px 18px',
        transition: 'background .25s, border-color .25s, box-shadow .25s',
      }}
    >
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: 8, justifyItems: 'center', alignItems: 'center' }}
        >
          {Array.from({ length: n }).map((_, i) => (
            <motion.img
              key={i}
              src={getObjectImageUrl(objectName)}
              alt={objectName}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.03, type: 'spring', stiffness: 220, damping: 14 }}
              className="drop-shadow-md"
              style={{ width: size, height: size, objectFit: 'contain' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          ))}
        </div>
      </div>
      <div
        className="rounded-full px-6 py-1.5 mt-1"
        style={{
          background: matched ? '#22c55e' : tone.bg,
          color: matched ? 'white' : tone.text,
          border: `1.5px solid ${matched ? 'transparent' : tone.border}`,
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 800,
          fontSize: '1.05rem',
          whiteSpace: 'nowrap',
        }}
      >
        {target.label}
      </div>
      {matched && (
        <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} className="absolute -top-3 -right-3">
          <CheckCircle className="w-10 h-10 text-emerald-500 drop-shadow-lg fill-white" />
        </motion.div>
      )}
    </motion.div>
  );
}


const DragDropMatchGame: React.FC<DragDropMatchGameProps> = ({ step, onSuccess }) => {
  const data = step.data || {};
  const instruction = data.instruction || 'Drag each item to the correct match!';
  const rawDraggables: DraggableData[] = data.draggables || [];
  const rawTargets: Target[] = data.targets || [];
  const instructionAudio = step.instruction_audio_url;
  const isMobile = useIsMobile();
  const {
    play: playSharedAudio,
    playDrop,
    playDrag,
    playMatch,
    playPerfectMatch,
    stopDrag,
    stopEffects,
  } = useGameAudio();

  // Detect "match number to objects" schema and rebuild targets with random unique objects.
  const isNumberMatch = React.useMemo(() => {
    const schema: string = data.schema || '';
    if (schema.includes('match_number_objects')) return true;
    return rawTargets.some((t: any) => t?.type === 'quantity_image' || typeof t?.quantity === 'number');
  }, [data.schema, rawTargets]);

  /** Letters mode data (unchanged behaviour). */
  const letterData = React.useMemo(() => {
    if (isNumberMatch) return { draggables: [] as DraggableData[], targets: [] as Target[] };
    const fixedTargets: Target[] = rawTargets.map((t) => {
      const objName = resolveTargetObjectName(t);
      const wordLabel = objName ? objName.charAt(0).toUpperCase() + objName.slice(1) : t.label;
      return { ...t, label: wordLabel };
    });
    return { draggables: shuffleArr(rawDraggables), targets: shuffleArr(fixedTargets) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id, isNumberMatch]);

  /** Numbers mode: build ordered pairs, then chunk into pages of exactly 2 pairs. */
  const numberPages = React.useMemo(() => {
    if (!isNumberMatch) return [] as { draggables: DraggableData[]; targets: Target[] }[];

    const numberDraggables = rawDraggables
      .map((d: any) => ({ ...d, _num: Number(d.value ?? d.label) }))
      .filter((d) => !isNaN(d._num))
      .sort((a, b) => a._num - b._num);

    // One unique object per number across the whole activity
    const picked = shuffleArr(OBJECT_POOL).slice(0, numberDraggables.length);

    const pairs = numberDraggables.map((d, i) => {
      const obj = picked[i] || OBJECT_POOL[i % OBJECT_POOL.length];
      const n = d._num;
      const target: Target = {
        id: `target_${d.id}_${obj}`,
        label: `${n} ${pluralize(obj, n)}`,
        accepts: [d.id],
        quantity: n,
        objectName: obj,
      };
      return { draggable: d as DraggableData, target };
    });

    const PAGE_SIZE = 2;
    const pages: { draggables: DraggableData[]; targets: Target[] }[] = [];
    for (let i = 0; i < pairs.length; i += PAGE_SIZE) {
      const chunk = pairs.slice(i, i + PAGE_SIZE);
      pages.push({
        draggables: shuffleArr(chunk.map((p) => p.draggable)),
        targets: shuffleArr(chunk.map((p) => p.target)),
      });
    }
    return pages;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id, isNumberMatch]);

  const [page, setPage] = useState(0);
  const currentPage = numberPages[Math.min(page, Math.max(numberPages.length - 1, 0))];
  const draggables = isNumberMatch ? (currentPage?.draggables ?? []) : letterData.draggables;
  const targets = isNumberMatch ? (currentPage?.targets ?? []) : letterData.targets;
  const isLastPage = !isNumberMatch || page >= numberPages.length - 1;


  const [matches, setMatches] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [wrongTarget, setWrongTarget] = useState<string | null>(null);
  const interactionRef = React.useRef(0);
  const completionPlayedRef = React.useRef(false);
  const completionTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
  );

  useEffect(() => {
    stopEffects();
    completionPlayedRef.current = false;
    if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
    setMatches({});
    setActiveId(null);
    setWrongTarget(null);
    setPage(0);
    return () => {
      if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
      stopEffects();
    };
  }, [step.id, stopEffects]);

  const matchedDraggableIds = new Set(Object.values(matches));
  const allMatched = targets.length > 0 && targets.every(t => !!matches[t.id]);

  useEffect(() => {
    if (!allMatched || completionPlayedRef.current) return;
    completionPlayedRef.current = true;
    playPerfectMatch(`${step.id}:p${page}:complete`);
    if (!isLastPage) return; // wait for the child to press Next
    completionTimerRef.current = setTimeout(onSuccess, 900);
    return () => {
      if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
    };
  }, [allMatched, isLastPage, onSuccess, page, playPerfectMatch, step.id]);

  const goToNextPage = () => {
    stopEffects();
    completionPlayedRef.current = false;
    if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
    setMatches({});
    setActiveId(null);
    setWrongTarget(null);
    setPage(p => p + 1);
  };


  const handleDragStart = (event: DragStartEvent) => {
    const draggableId = String(event.active.id);
    setActiveId(draggableId);
    setWrongTarget(null);
    playDrag(`${step.id}:${draggableId}:${++interactionRef.current}`);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    stopDrag();
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const draggableId = String(active.id);
    const targetId = String(over.id);
    const target = targets.find(t => t.id === targetId);
    if (!target) return;

    if (target.accepts.includes(draggableId)) {
      const matchId = `${step.id}:${draggableId}:${targetId}`;
      playDrop(matchId);
      playMatch(matchId);
      setMatches(m => ({ ...m, [targetId]: draggableId }));
    } else {
      setWrongTarget(targetId);
      setTimeout(() => setWrongTarget(null), 600);
    }
  };

  const handleDragCancel = (_event: DragCancelEvent) => {
    stopDrag();
    setActiveId(null);
  };

  const handleReset = () => {
    stopEffects();
    completionPlayedRef.current = false;
    if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
    setMatches({});
    setActiveId(null);
    setWrongTarget(null);
  };

  const activeDraggable = draggables.find(d => d.id === activeId);
  const draggableBgUrl = getChoiceAssetByState('default');
  const cloudBgUrl = getGameAssetUrl('UI background/cloud background.png');

  const speakInstruction = () => {
    if (instructionAudio) {
      void playSharedAudio(getAssetUrl(instructionAudio));
      return;
    }
    try {
      const u = new SpeechSynthesisUtterance(instruction);
      u.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch { /* no-op */ }
  };

  return (
    <div
      className="flex flex-col items-center w-full min-h-0 sm:min-h-screen overflow-visible pb-3 sm:pb-8"
      style={{
        backgroundImage: !isMobile && cloudBgUrl ? `url(${cloudBgUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[34px] sm:text-4xl md:text-5xl font-extrabold text-primary-foreground text-center mt-2 sm:mt-4 mb-2 px-2 whitespace-nowrap"
        style={{
          textShadow: '0 3px 10px rgba(30,64,175,0.35)',
          fontFamily: "'Nunito', 'Comic Sans MS', cursive, sans-serif",
        }}
      >
        {isNumberMatch ? 'Number Matching' : 'Match Letters'}
      </motion.h1>

      {/* Instruction pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mobile-instruction-pill sm:rounded-full sm:px-6 sm:py-2.5 sm:mb-5 sm:mx-4 flex items-center justify-center sm:max-w-[92vw]"
        style={{
          background: 'rgba(255,255,255,0.9)',
          boxShadow: '0 8px 20px -10px rgba(30,64,175,0.5)',
          border: '2px solid rgba(147,197,253,0.6)',
        }}
      >
        {!isNumberMatch && isMobile && (
          <Button variant="ghost" size="icon" onClick={speakInstruction} aria-label="Play instruction" className="mobile-instruction-audio">
            <Volume2 className="h-5 w-5" />
          </Button>
        )}
        <p
          className="text-center text-[15px] min-[375px]:text-base sm:text-lg font-extrabold"
          style={{ color: '#2C5F7C', fontFamily: "'Nunito', sans-serif" }}
        >
          {!isNumberMatch && isMobile ? 'Drag each letter to the correct picture!' : instruction}
        </p>
      </motion.div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
        {isNumberMatch ? (
          isMobile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="w-full flex flex-col items-center gap-4 px-4"
            style={{ maxWidth: 480 }}
          >
            {/* Number tiles row */}
            <div className="w-full flex items-center justify-center gap-4 flex-wrap">
              {draggables.map((item, i) => (
                <NumberTile
                  key={item.id}
                  item={item}
                  matched={matchedDraggableIds.has(item.id)}
                  dragging={activeId === item.id}
                  color={['#2563EB', '#F97316', '#7C3AED', '#DB2777'][i % 4]}
                />
              ))}
            </div>

            {/* Down arrow hint */}
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              className="flex items-center justify-center"
            >
              <ArrowRight
                className="w-8 h-8 rotate-90"
                style={{ color: 'rgba(255,255,255,0.9)' }}
                strokeWidth={3}
              />
            </motion.div>

            {/* Object cards stacked vertically */}
            <div className="w-full flex flex-col gap-4">
              {targets.map((target) => {
                const matched = !!matches[target.id];
                const tone = LABEL_TONES[(target.quantity || 0) % LABEL_TONES.length];
                return (
                  <motion.div
                    key={target.id}
                    className="w-full"
                    animate={
                      wrongTarget === target.id
                        ? { x: [0, -8, 8, -4, 4, 0] }
                        : matched
                        ? { scale: [1, 1.03, 1] }
                        : {}
                    }
                  >
                    <ObjectCard target={target} matched={matched} tone={tone} />
                  </motion.div>
                );
              })}
            </div>

            {allMatched && !isLastPage && (
              <button
                onClick={goToNextPage}
                className="w-full rounded-2xl font-extrabold flex items-center justify-center gap-2 text-white mt-1"
                style={{
                  height: 64,
                  background: 'linear-gradient(135deg,#22C55E,#15803D)',
                  boxShadow: '0 12px 24px -10px rgba(21,128,61,0.8)',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '1.15rem',
                }}
              >
                Next <ArrowRight className="w-6 h-6" />
              </button>
            )}

            {/* Bottom controls */}
            <div className="w-full grid grid-cols-2 gap-3 mt-3">
              <button
                onClick={handleReset}
                className="rounded-2xl font-extrabold flex items-center justify-center gap-2"
                style={{
                  height: 60,
                  background: 'rgba(255,255,255,0.95)',
                  color: '#2563EB',
                  border: '2px solid rgba(147,197,253,0.8)',
                  boxShadow: '0 10px 22px -12px rgba(30,64,175,0.6)',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '1.05rem',
                }}
              >
                <RotateCcw className="w-5 h-5" /> Try Again
              </button>
              <button
                onClick={speakInstruction}
                className="rounded-2xl font-extrabold flex items-center justify-center gap-2 text-white"
                style={{
                  height: 60,
                  background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)',
                  boxShadow: '0 10px 22px -10px rgba(109,40,217,0.8)',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '1.05rem',
                }}
              >
                <Volume2 className="w-5 h-5" /> Read
              </button>
            </div>
          </motion.div>
          ) : (
          /* DESKTOP / TABLET: two aligned matching rows */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="w-full mx-auto flex flex-col items-center gap-6 px-6"
            style={{ maxWidth: 1180 }}
          >
            {draggables.map((item, i) => {
              const target = targets.find(t => t.accepts.includes(item.id));
              if (!target) return null;
              const matched = !!matches[target.id];
              const tone = LABEL_TONES[(target.quantity || 0) % LABEL_TONES.length];
              return (
                <div key={item.id} className="w-full flex items-center justify-center gap-6 lg:gap-10">
                  <DesktopNumberTile
                    item={item}
                    matched={matchedDraggableIds.has(item.id)}
                    dragging={activeId === item.id}
                    color={['#2563EB', '#F97316', '#7C3AED', '#DB2777'][i % 4]}
                  />
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                    className="flex-shrink-0"
                  >
                    <ArrowRight className="w-10 h-10" style={{ color: 'rgba(255,255,255,0.9)' }} strokeWidth={3} />
                  </motion.div>
                  <DesktopObjectCard
                    target={target}
                    matched={matched}
                    isWrong={wrongTarget === target.id}
                    tone={tone}
                  />
                </div>
              );
            })}

            {allMatched && !isLastPage && (
              <button
                onClick={goToNextPage}
                className="rounded-2xl font-extrabold flex items-center justify-center gap-2 text-white px-10"
                style={{
                  height: 60,
                  background: 'linear-gradient(135deg,#22C55E,#15803D)',
                  boxShadow: '0 12px 24px -10px rgba(21,128,61,0.8)',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '1.15rem',
                }}
              >
                Next <ArrowRight className="w-6 h-6" />
              </button>
            )}
          </motion.div>
          )

        ) : (

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full px-3 sm:px-[3%] overflow-visible"
        >
          {/* MOBILE-FIRST: draggables in a horizontal row up top, targets in a 2-col grid below.
              At sm+ we keep the original paired-row layout for larger screens. */}

          {/* Mobile layout (< sm) */}
          <div className="sm:hidden flex flex-col items-center w-full mobile-letter-game">
            {/* Four tactile letter choices in a no-overflow 2×2 grid. */}
            <div className="mobile-letter-grid">
                {draggables.map((item) => (
                  <MobileLetterTile
                    key={item.id}
                    item={item}
                    isMatched={matchedDraggableIds.has(item.id)}
                    isDragging={activeId === item.id}
                  />
                ))}
            </div>

            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              className="mobile-drag-guide"
              aria-hidden="true"
            >
              <span className="mobile-drag-dots">•••</span>
              <ArrowDown className="h-6 w-6" strokeWidth={3} />
              <span>drag here</span>
            </motion.div>

            {/* Equal picture targets in a fixed two-column grid. */}
            <div className="mobile-picture-grid">
              {targets.map((target) => (
                <MobilePictureCard
                  key={target.id}
                  target={target}
                  matched={!!matches[target.id]}
                  wrong={wrongTarget === target.id}
                />
              ))}
            </div>

            <Button type="button" variant="ghost" onClick={speakInstruction} className="mobile-hint-pill">
              <Lightbulb className="h-5 w-5 text-funquest-warning" />
              <span>Drag the letter to its picture!</span>
            </Button>
          </div>

          {/* Desktop / tablet layout (>= sm) — original paired rows */}
          <div className="hidden sm:block">
          {(() => {
            const pairsPerRow = 2;
            const rows: { draggables: typeof draggables; targets: typeof targets }[] = [];
            const totalRows = Math.ceil(Math.max(draggables.length, targets.length) / pairsPerRow);
            for (let r = 0; r < totalRows; r++) {
              rows.push({
                draggables: draggables.slice(r * pairsPerRow, (r + 1) * pairsPerRow),
                targets: targets.slice(r * pairsPerRow, (r + 1) * pairsPerRow),
              });
            }
            return rows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex items-center justify-center gap-4 sm:gap-8 md:gap-12 mb-6">
                {/* Draggables for this row */}
                <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-6">
                  {row.draggables.map((item) => (
                    <div key={item.id} className="flex-shrink-0" style={{ width: 'clamp(130px, 21vw, 230px)' }}>
                      <DraggableItem
                        item={item}
                        isMatched={matchedDraggableIds.has(item.id)}
                        isDragging={activeId === item.id}
                      />
                    </div>
                  ))}
                </div>

                {/* Arrow */}
                {rowIdx === 0 && (
                  <div className="flex-shrink-0 hidden sm:flex items-center">
                    <motion.div
                      animate={{ x: [0, 8, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    >
                      <ArrowRight
                        className="w-8 h-8 md:w-12 md:h-12"
                        style={{ color: 'rgba(255,255,255,0.7)' }}
                        strokeWidth={2.5}
                      />
                    </motion.div>
                  </div>
                )}
                {rowIdx !== 0 && (
                  <div className="flex-shrink-0 hidden sm:flex items-center w-8 md:w-12" />
                )}

                {/* Targets for this row */}
                <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-6">
                  {row.targets.map((target) => (
                    <motion.div
                      key={target.id}
                      className="flex-shrink-0"
                      style={{ width: 'clamp(130px, 21vw, 230px)' }}
                      animate={wrongTarget === target.id ? { x: [0, -6, 6, -3, 3, 0] } : {}}
                    >
                      <DroppableTarget
                        target={target}
                        matchedItem={matches[target.id] ? draggables.find(d => d.id === matches[target.id]) || null : null}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            ));
          })()}
          </div>

        </motion.div>
        )}



        {/* Drag overlay */}
        <DragOverlay>
          {activeDraggable ? (
            <div
              className="relative aspect-square flex items-center justify-center"
              style={{ width: isMobile ? 'clamp(90px, 29vw, 120px)' : 'clamp(100px, 18vw, 200px)' }}
            >
              <img
                src={draggableBgUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />
              <div className="relative z-10 flex items-center justify-center w-[65%] h-[65%]">
                {activeDraggable.image ? (
                  <img src={getAssetUrl(activeDraggable.image)} alt={activeDraggable.label} className="w-full h-full object-contain" />
                ) : (() => {
                  const asset = resolveContentAsset(activeDraggable.label);
                  return asset ? (
                    <img src={asset} alt={activeDraggable.label} className="w-full h-full object-contain" />
                  ) : (
                    <span
                      className="font-extrabold drop-shadow-sm"
                      style={{
                        fontSize: 'clamp(2rem, 5vw, 4rem)',
                        color: '#3B82F6',
                        fontFamily: "'Nunito', 'Comic Sans MS', cursive, sans-serif",
                      }}
                    >
                      {activeDraggable.label}
                    </span>
                  );
                })()}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Success overlay */}
      <AnimatePresence>
        {allMatched && (
          <FeedbackOverlay show={allMatched} correct={true} correctText="All matched! 🎉" />
        )}
      </AnimatePresence>

      {!allMatched && Object.keys(matches).length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="rounded-full gap-1.5 text-white/80 hover:text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default DragDropMatchGame;
