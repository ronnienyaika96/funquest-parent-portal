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
} from '@dnd-kit/core';
import { getAssetUrl } from '@/pages/PlayActivityPage';
import { motion } from 'framer-motion';
import { CheckCircle, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Draggable {
  id: string;
  label: string;
  image?: string;
}

interface Target {
  id: string;
  label: string;
  image?: string;
  accepts: string[]; // draggable ids that are correct for this target
}

interface DragDropMatchGameProps {
  step: any;
  onSuccess: () => void;
}

// ---------- Draggable Item ----------
function DraggableItem({
  item,
  isMatched,
  isDragging,
}: {
  item: Draggable;
  isMatched: boolean;
  isDragging: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });

  const style: React.CSSProperties = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.4 : isMatched ? 0.5 : 1,
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`p-3 rounded-xl border-2 transition-colors flex flex-col items-center gap-1 min-w-[80px] select-none cursor-grab active:cursor-grabbing ${
        isMatched
          ? 'border-green-400 bg-green-50'
          : 'border-border bg-card hover:shadow-md'
      }`}
    >
      {item.image && (
        <img src={getAssetUrl(item.image)} alt={item.label} className="w-14 h-14 object-contain pointer-events-none" />
      )}
      <span className="text-sm font-semibold text-foreground pointer-events-none">{item.label}</span>
    </div>
  );
}

// ---------- Droppable Target ----------
function DroppableTarget({
  target,
  matchedItem,
  isOver,
}: {
  target: Target;
  matchedItem: Draggable | null;
  isOver: boolean;
}) {
  const { setNodeRef, isOver: over } = useDroppable({ id: target.id });
  const active = isOver || over;

  return (
    <div
      ref={setNodeRef}
      className={`p-3 rounded-xl border-2 border-dashed transition-all flex flex-col items-center gap-1 min-w-[80px] min-h-[90px] justify-center ${
        matchedItem
          ? 'border-green-400 bg-green-50'
          : active
          ? 'border-primary bg-primary/10 scale-105'
          : 'border-muted-foreground/30 bg-muted/30'
      }`}
    >
      {target.image && (
        <img src={getAssetUrl(target.image)} alt={target.label} className="w-14 h-14 object-contain" />
      )}
      <span className="text-sm font-medium text-foreground">{target.label}</span>
      {matchedItem && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
        </motion.div>
      )}
    </div>
  );
}

// ---------- dnd-kit hooks (inline to avoid extra files) ----------
import { useDraggable, useDroppable } from '@dnd-kit/core';

// ---------- Main Component ----------
const DragDropMatchGame: React.FC<DragDropMatchGameProps> = ({ step, onSuccess }) => {
  const data = step.data || {};
  const instruction = data.instruction || 'Drag items to their match!';
  const draggables: Draggable[] = data.draggables || [];
  const targets: Target[] = data.targets || [];
  const instructionAudio = step.instruction_audio_url;

  // matches: targetId -> draggableId
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
    if (allMatched) {
      setTimeout(onSuccess, 900);
    }
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
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-2">
        <p className="text-lg font-bold text-foreground text-center">{instruction}</p>
        {instructionAudio && (
          <button onClick={() => new Audio(getAssetUrl(instructionAudio)).play().catch(() => {})} className="text-primary">
            <Volume2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-col sm:flex-row gap-8 w-full max-w-md justify-center items-start">
          {/* Draggables */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-muted-foreground text-center">Drag</p>
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
            <p className="text-xs font-semibold text-muted-foreground text-center">Drop Here</p>
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
            <div className="p-3 rounded-xl border-2 border-primary bg-card shadow-lg flex flex-col items-center gap-1 min-w-[80px]">
              {activeDraggable.image && (
                <img src={getAssetUrl(activeDraggable.image)} alt={activeDraggable.label} className="w-14 h-14 object-contain" />
              )}
              <span className="text-sm font-semibold text-foreground">{activeDraggable.label}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {allMatched && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-green-600 font-bold text-lg">
          <CheckCircle className="w-6 h-6" /> All matched! 🎉
        </motion.div>
      )}

      {!allMatched && Object.keys(matches).length > 0 && (
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-1" /> Reset
        </Button>
      )}
    </div>
  );
};

export default DragDropMatchGame;
