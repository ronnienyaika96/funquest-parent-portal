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
import { getDraggableAssetUrl, getDropZoneAssetUrl } from '@/lib/gameAssets';
import { getLetterAsset } from '@/lib/letterAssets';
import { getNumberAsset } from '@/lib/numberAssets';
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
}

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
  const draggableBg = getDraggableAssetUrl();
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

  return (
    <motion.div
      ref={setNodeRef}
      animate={isOver ? { scale: 1.06 } : { scale: 1 }}
      className="relative aspect-square flex flex-col items-center justify-center"
    >
      {/* SVG drop zone background */}
      <img
        src={dropBg}
        alt=""
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full gap-1 p-3">
        {target.image && (
          <img
            src={getAssetUrl(target.image)}
            alt={target.label}
            className="w-[55%] h-[50%] object-contain drop-shadow-md"
          />
        )}
        {/* Label */}
        <div
          className="rounded-lg px-3 py-1 mt-auto"
          style={{
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(148,163,184,0.3)',
          }}
        >
          <span
            className="font-bold text-sm sm:text-base"
            style={{
              color: '#334155',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            {target.label}
          </span>
        </div>

        {matchedItem && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
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
  const draggables: DraggableData[] = data.draggables || [];
  const targets: Target[] = data.targets || [];
  const instructionAudio = step.instruction_audio_url;

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
  const draggableBgUrl = getDraggableAssetUrl();

  return (
    <div className="flex flex-col items-center w-full overflow-visible">
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
        {/* Horizontal layout: draggables → arrow → targets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-6 sm:gap-10 md:gap-16 w-full px-[4%] overflow-visible"
        >
          {/* Draggables */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {draggables.map((item) => (
              <div key={item.id} className="flex-shrink-0" style={{ width: 'clamp(100px, 18vw, 200px)' }}>
                <DraggableItem
                  item={item}
                  isMatched={matchedDraggableIds.has(item.id)}
                  isDragging={activeId === item.id}
                />
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 hidden sm:flex items-center">
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <ArrowRight
                className="w-10 h-10 md:w-14 md:h-14"
                style={{ color: 'rgba(255,255,255,0.7)' }}
                strokeWidth={2.5}
              />
            </motion.div>
          </div>

          {/* Targets */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {targets.map((target) => (
              <motion.div
                key={target.id}
                className="flex-shrink-0"
                style={{ width: 'clamp(120px, 20vw, 220px)' }}
                animate={wrongTarget === target.id ? { x: [0, -6, 6, -3, 3, 0] } : {}}
              >
                <DroppableTarget
                  target={target}
                  matchedItem={matches[target.id] ? draggables.find(d => d.id === matches[target.id]) || null : null}
                />
              </motion.div>
            ))}
          </div>
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
