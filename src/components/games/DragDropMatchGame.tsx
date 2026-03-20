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
import { motion } from 'framer-motion';
import { CheckCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getGameAssetUrl, TILE_ASSETS } from '@/lib/funquest-assets';
import FeedbackOverlay from './FeedbackOverlay';
import InstructionBar from './InstructionBar';

interface Draggable {
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

function DraggableItem({ item, isMatched, isDragging }: { item: Draggable; isMatched: boolean; isDragging: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });

  const tileBg = getGameAssetUrl(isMatched ? TILE_ASSETS.choiceCorrect : TILE_ASSETS.draggable);

  const style: React.CSSProperties = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.4 : isMatched ? 0.7 : 1,
    touchAction: 'none',
    backgroundImage: `url(${tileBg})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`p-4 rounded-2xl flex flex-col items-center gap-2 min-w-[90px] min-h-[90px] select-none cursor-grab active:cursor-grabbing justify-center shadow-soft transition-shadow hover:shadow-medium`}
    >
      {item.image && (
        <img src={getAssetUrl(item.image)} alt={item.label} className="w-12 h-12 object-contain pointer-events-none drop-shadow-md" />
      )}
      <span className="text-sm font-bold text-foreground pointer-events-none">{item.label}</span>
    </div>
  );
}

function DroppableTarget({ target, matchedItem, isOver }: { target: Target; matchedItem: Draggable | null; isOver: boolean }) {
  const { setNodeRef, isOver: over } = useDroppable({ id: target.id });
  const active = isOver || over;

  const tileBg = getGameAssetUrl(matchedItem ? TILE_ASSETS.dropZoneCorrect : TILE_ASSETS.dropZoneEmpty);

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-2xl flex flex-col items-center gap-2 min-w-[90px] min-h-[90px] justify-center transition-all ${
        active ? 'scale-105 shadow-medium' : 'shadow-soft'
      }`}
      style={{
        backgroundImage: `url(${tileBg})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {target.image && (
        <img src={getAssetUrl(target.image)} alt={target.label} className="w-12 h-12 object-contain" />
      )}
      <span className="text-sm font-semibold text-foreground">{target.label}</span>
      {matchedItem && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <CheckCircle className="w-5 h-5 text-funquest-success" />
        </motion.div>
      )}
    </div>
  );
}

const DragDropMatchGame: React.FC<DragDropMatchGameProps> = ({ step, onSuccess }) => {
  const data = step.data || {};
  const instruction = data.instruction || 'Drag items to their match!';
  const draggables: Draggable[] = data.draggables || [];
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

  return (
    <div className="flex flex-col items-center gap-6">
      <InstructionBar text={instruction} audioUrl={instructionAudio} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-col sm:flex-row gap-8 w-full max-w-md justify-center items-start">
          {/* Draggables */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-muted-foreground text-center uppercase tracking-wide">Drag</p>
            {draggables.map(item => (
              <DraggableItem
                key={item.id}
                item={item}
                isMatched={matchedDraggableIds.has(item.id)}
                isDragging={activeId === item.id}
              />
            ))}
          </div>

          {/* Targets */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-muted-foreground text-center uppercase tracking-wide">Drop Here</p>
            {targets.map(target => (
              <motion.div
                key={target.id}
                animate={wrongTarget === target.id ? { x: [0, -6, 6, -3, 3, 0] } : {}}
              >
                <DroppableTarget
                  target={target}
                  matchedItem={matches[target.id] ? draggables.find(d => d.id === matches[target.id]) || null : null}
                  isOver={false}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeDraggable ? (
            <div
              className="p-4 rounded-2xl shadow-strong flex flex-col items-center gap-2 min-w-[90px]"
              style={{
                backgroundImage: `url(${getGameAssetUrl(TILE_ASSETS.choiceSelected)})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            >
              {activeDraggable.image && (
                <img src={getAssetUrl(activeDraggable.image)} alt={activeDraggable.label} className="w-12 h-12 object-contain" />
              )}
              <span className="text-sm font-bold text-foreground">{activeDraggable.label}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <FeedbackOverlay
        show={allMatched}
        correct={allMatched ? true : null}
        correctText="All matched! 🎉"
      />

      {!allMatched && Object.keys(matches).length > 0 && (
        <Button variant="ghost" size="sm" onClick={handleReset} className="rounded-full gap-1.5 text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      )}
    </div>
  );
};

export default DragDropMatchGame;
