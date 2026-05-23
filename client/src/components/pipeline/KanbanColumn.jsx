import { useDroppable } from '@dnd-kit/core';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import KanbanCard from './KanbanCard';
import { STAGE_COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const KanbanColumn = ({ stage, leads, activeId, totalValue }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: { type: 'column', stage },
  });

  const stageStyle = STAGE_COLORS[stage] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div
      className={`flex w-[min(100%,280px)] shrink-0 flex-col rounded-xl border transition-all duration-200 sm:w-72 ${
        isOver
          ? 'border-brand-400 bg-brand-50/40 shadow-md ring-2 ring-brand-200/50'
          : 'border-surface-200 bg-surface-50/80'
      }`}
    >
      <div className="border-b border-surface-200 px-3 py-3 sm:px-4">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${stageStyle}`}
          >
            {stage}
          </span>
          <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-white px-2 text-xs font-bold text-surface-800 shadow-sm">
            {leads.length}
          </span>
        </div>
        {totalValue > 0 && (
          <p className="mt-2 text-[11px] font-medium text-slate-500">
            {formatCurrency(totalValue)} pipeline value
          </p>
        )}
      </div>

      <div
        ref={setNodeRef}
        className="flex max-h-[calc(100vh-280px)] min-h-[420px] flex-1 flex-col gap-2.5 overflow-y-auto p-3 scrollbar-thin"
      >
        {leads.map((lead) => (
          <KanbanCard key={lead._id} lead={lead} isDragging={activeId === lead._id} />
        ))}

        {leads.length === 0 && (
          <div
            className={`flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed px-3 py-10 text-center transition ${
              isOver ? 'border-brand-300 bg-brand-50/50' : 'border-surface-200'
            }`}
          >
            <p className="text-xs text-slate-400">
              {isOver ? 'Release to drop' : 'Drop leads here'}
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-surface-200 p-2">
        <Link
          to="/leads"
          state={{ defaultStage: stage }}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-slate-500 transition hover:bg-white hover:text-brand-600"
        >
          <FiPlus className="h-3.5 w-3.5" />
          Add lead
        </Link>
      </div>
    </div>
  );
};

export default KanbanColumn;
