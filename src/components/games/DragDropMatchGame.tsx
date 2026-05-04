import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
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
import { CheckCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <div className={`relative z-10 flex flex-col items-center justify-center text-center ${isQuantityMode ? 'w-full' : 'w-full h-full gap-1 p-3'}`}>
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
              className="w-[55%] h-[50%] object-contain drop-shadow-md"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                // Try the original step-data image as a fallback before hiding
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
          className={`rounded-lg px-3 py-1 text-center ${isQuantityMode ? 'mt-2' : 'mt-auto'}`}
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

const DragDropMatchGame: React.FC<DragDropMatchGameProps> = ({ step, onSuccess }) => {
  const data = step.data || {};
  const instruction = data.instruction || 'Drag each item to the correct match!';
  const rawDraggables: DraggableData[] = data.draggables || [];
  const rawTargets: Target[] = data.targets || [];
  const instructionAudio = step.instruction_audio_url;

  // Detect "match number to objects" schema and rebuild targets with random unique objects.
  const isNumberMatch = React.useMemo(() => {
    const schema: string = data.schema || '';
    if (schema.includes('match_number_objects')) return true;
    return rawTargets.some((t: any) => t?.type === 'quantity_image' || typeof t?.quantity === 'number');
  }, [data.schema, rawTargets]);

  const { draggables, targets } = React.useMemo(() => {
    if (!isNumberMatch) return { draggables: rawDraggables, targets: rawTargets };

    // Pair each number-draggable with a unique random object from the pool
    const numberDraggables = rawDraggables
      .map((d: any) => ({ ...d, _num: Number(d.value ?? d.label) }))
      .filter((d) => !isNaN(d._num));

    const picked = shuffleArr(OBJECT_POOL).slice(0, numberDraggables.length);

    const newTargets: Target[] = numberDraggables.map((d, i) => {
      const obj = picked[i];
      const n = d._num;
      return {
        id: `target_${d.id}_${obj}`,
        label: `${n} ${pluralize(obj, n)}`,
        accepts: [d.id],
        quantity: n,
        objectName: obj,
      };
    });

    const shuffledDraggables = shuffleArr(numberDraggables);
    const shuffledTargets = shuffleArr(newTargets);

    // eslint-disable-next-line no-console
    console.log('[DragDropMatchGame] Numbers round →', {
      pairs: newTargets.map(t => ({ n: t.quantity, obj: t.objectName })),
      shuffledNumbers: shuffledDraggables.map(d => d.label),
      shuffledDrops: shuffledTargets.map(t => t.label),
    });

    return { draggables: shuffledDraggables as DraggableData[], targets: shuffledTargets };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id, isNumberMatch]);

  const [matches, setMatches] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [wrongTarget, setWrongTarget] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
  );

  useEffect(() => {
    if (instructionAudio) {
      new Audio(getAssetUrl(instructionAudio)).play().catch(() => {});
    }
  }, [instructionAudio]);

  // Reset state when step (round) changes
  useEffect(() => {
    setMatches({});
    setActiveId(null);
    setWrongTarget(null);
  }, [step.id]);

  const matchedDraggableIds = new Set(Object.values(matches));
  const allMatched = targets.length > 0 && targets.every(t => !!matches[t.id]);

  useEffect(() => {
    if (allMatched) setTimeout(onSuccess, 900);
  }, [allMatched, onSuccess]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    setWrongTarget(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const draggableId = String(active.id);
    const targetId = String(over.id);
    const target = targets.find(t => t.id === targetId);
    if (!target) return;

    if (target.accepts.includes(draggableId)) {
      setMatches(m => ({ ...m, [targetId]: draggableId }));
    } else {
      setWrongTarget(targetId);
      setTimeout(() => setWrongTarget(null), 600);
    }
  };

  const handleReset = () => {
    setMatches({});
    setActiveId(null);
    setWrongTarget(null);
  };

  const activeDraggable = draggables.find(d => d.id === activeId);
  const draggableBgUrl = getChoiceAssetByState('default');
  const cloudBgUrl = getGameAssetUrl('UI background/cloud background.png');

  return (
    <div
      className="flex flex-col items-center w-full min-h-screen overflow-visible"
      style={{
        backgroundImage: cloudBgUrl ? `url(${cloudBgUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center tracking-wide mt-4 mb-2"
        style={{
          textShadow: '0 2px 8px rgba(0,0,0,0.12)',
          fontFamily: "'Nunito', 'Comic Sans MS', cursive, sans-serif",
        }}
      >
        Match Letters
      </motion.h1>

      {/* Instruction bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-3xl rounded-full px-8 py-3 mb-6 flex items-center justify-center"
        style={{
          background: 'rgba(173, 216, 240, 0.55)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <p
          className="text-center text-base sm:text-lg md:text-xl font-bold"
          style={{ color: '#2C5F7C', fontFamily: "'Nunito', sans-serif" }}
        >
          {instruction}
        </p>
      </motion.div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Grid layout: rows of paired draggables + targets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full px-[3%] overflow-visible"
        >
          {(() => {
            // Pair draggables with targets row by row (2 pairs per row)
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
        </motion.div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeDraggable ? (
            <div
              className="relative aspect-square flex items-center justify-center"
              style={{ width: 'clamp(100px, 18vw, 200px)' }}
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
