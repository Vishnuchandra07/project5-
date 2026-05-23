import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { LEAD_STAGES } from '../../utils/constants';
import { useKanbanBoard } from '../../hooks/useKanbanBoard';
import KanbanColumn from './KanbanColumn';
import KanbanCardContent from './KanbanCardContent';
import Spinner from '../ui/Spinner';

const KanbanBoard = ({ board: initialBoard, onUpdate }) => {
  const {
    board,
    activeLead,
    updating,
    error,
    columnTotals,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useKanbanBoard(initialBoard, onUpdate);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    useSensor(KeyboardSensor)
  );

  return (
    <div className="relative">
      {error && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {updating && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center pt-8">
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-elevated">
            <Spinner size="sm" />
            <span className="text-xs font-medium text-slate-600">Saving...</span>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-4 scrollbar-thin sm:gap-4"
          role="list"
          aria-label="Kanban pipeline board"
        >
          {LEAD_STAGES.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              leads={board[stage] || []}
              activeId={activeLead?._id}
              totalValue={columnTotals[stage]}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
          {activeLead ? (
            <div className="w-72 cursor-grabbing">
              <KanbanCardContent lead={activeLead} isOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <p className="mt-2 text-center text-xs text-slate-400 sm:text-left">
        Drag a card into another column to change its stage — it saves when you release
      </p>
    </div>
  );
};

export default KanbanBoard;
