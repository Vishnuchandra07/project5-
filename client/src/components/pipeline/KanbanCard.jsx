import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import KanbanCardContent from './KanbanCardContent';

const KanbanCard = ({ lead, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging: isDraggingState } =
    useDraggable({
      id: lead._id,
      data: { type: 'lead', lead, stage: lead.stage },
    });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  const hidden = isDragging || isDraggingState;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`touch-none ${hidden ? 'opacity-40' : 'opacity-100'}`}
    >
      <div
        className={`cursor-grab transition active:cursor-grabbing ${
          hidden ? '' : 'hover:scale-[1.02]'
        }`}
      >
        <KanbanCardContent lead={lead} />
      </div>
    </div>
  );
};

export default KanbanCard;
