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
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeedbackOverlay from './FeedbackOverlay';
import InstructionBar from './InstructionBar';

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

const LABEL_COLORS = ['#EF4444', '#F97316', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'];

function DraggableItem({ item, isMatched, isDragging, colorIndex }: {
  item: DraggableData; isMatched: boolean; isDragging: boolean; colorIndex: number;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });

  const style: React.CSSProperties = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.3 : isMatched ? 0.5 : 1,
    touchAction: 'none',
  };

  const color = LABEL_COLORS[colorIndex % LABEL_COLORS.length];

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      whileHover={!isMatched ? { scale: 1.08 } : {}}
      whileTap={!isMatched ? { scale: 0.95 } : {}}
      className={`relative flex items-center justify-center rounded-2xl cursor-grab active:cursor-grabbing select-none transition-all
        ${isMatched ? 'pointer-events-none' : ''}
      `}
    >
      {/* Tile background */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: isMatched
            ? 'linear-gradient(145deg, #D1FAE5, #A7F3D0)'
            : 'linear-gradient(145deg, #FFFFFF, #F1F5F9)',
          boxShadow: isMatched
            ? '0 2px 8px rgba(34,197,94,0.3)'
            : '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {item.image ? (
          <img
            src={getAssetUrl(item.image)}
            alt={item.label}
            className="w-[70%] h-[70%] object-contain drop-shadow-md pointer-events-none"
          />
        ) : (
          <span
            className="font-extrabold pointer-events-none drop-shadow-sm"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color,
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

function DroppableTarget({ target, matchedItem, colorIndex }: {
  target: Target; matchedItem: DraggableData | null; colorIndex: number;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: target.id });
  const color = LABEL_COLORS[colorIndex % LABEL_COLORS.length];

  return (
    <motion.div
      ref={setNodeRef}
      animate={isOver ? { scale: 1.06 } : { scale: 1 }}
      className="relative flex flex-col items-center justify-center rounded-2xl transition-all"
    >
      {/* Card background */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: matchedItem
            ? 'linear-gradient(145deg, #DBEAFE, #BFDBFE)'
            : 'linear-gradient(145deg, #EFF6FF, #DBEAFE)',
          border: matchedItem
            ? '3px solid #60A5FA'
            : isOver
            ? '3px solid #93C5FD'
            : '3px dashed #93C5FD',
          boxShadow: isOver
            ? '0 8px 24px rgba(59,130,246,0.2)'
            : '0 4px 12px rgba(0,0,0,0.06)',
        }}
      />

      {/* Image area */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full gap-1 p-3">
        {target.image && (
          <img
            src={getAssetUrl(target.image)}
            alt={target.label}
            className="w-[65%] h-[55%] object-contain drop-shadow-md"
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

  // Responsive tile size: ~20% of viewport width, clamped
  const tileStyle: React.CSSProperties = {
    width: 'clamp(100px, 18vw, 200px)',
    height: 'clamp(100px, 18vw, 200px)',
  };

  const targetTileStyle: React.CSSProperties = {
    width: 'clamp(120px, 20vw, 220px)',
    height: 'clamp(140px, 22vw, 260px)',
  };

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
        {/* Main horizontal layout: draggables → arrow → targets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-6 sm:gap-10 md:gap-16 w-full px-[4%] overflow-visible"
        >
          {/* Draggables row */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {draggables.map((item, i) => (
              <div key={item.id} style={tileStyle} className="flex-shrink-0">
                <DraggableItem
                  item={item}
                  isMatched={matchedDraggableIds.has(item.id)}
                  isDragging={activeId === item.id}
                  colorIndex={i}
                />
              </div>
            ))}
          </div>

          {/* Arrow indicator */}
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

          {/* Targets row */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {targets.map((target, i) => (
              <motion.div
                key={target.id}
                style={targetTileStyle}
                className="flex-shrink-0"
                animate={wrongTarget === target.id ? { x: [0, -6, 6, -3, 3, 0] } : {}}
              >
                <DroppableTarget
                  target={target}
                  matchedItem={matches[target.id] ? draggables.find(d => d.id === matches[target.id]) || null : null}
                  colorIndex={i}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeDraggable ? (
            <div
              className="rounded-2xl flex items-center justify-center"
              style={{
                ...tileStyle,
                background: 'linear-gradient(145deg, #DBEAFE, #BFDBFE)',
                boxShadow: '0 12px 32px rgba(59,130,246,0.3)',
              }}
            >
              {activeDraggable.image ? (
                <img src={getAssetUrl(activeDraggable.image)} alt={activeDraggable.label} className="w-[70%] h-[70%] object-contain" />
              ) : (
                <span
                  className="font-extrabold drop-shadow-sm"
                  style={{
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                    color: '#3B82F6',
                    fontFamily: "'Nunito', 'Comic Sans MS', cursive, sans-serif",
                  }}
                >
                  {activeDraggable.label}
                </span>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Match hints bar at bottom */}
      <AnimatePresence>
        {allMatched && (
          <FeedbackOverlay
            show={allMatched}
            correct={true}
            correctText="All matched! 🎉"
          />
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
