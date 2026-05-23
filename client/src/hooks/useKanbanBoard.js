import { useState, useEffect, useCallback } from 'react';
import { LEAD_STAGES } from '../utils/constants';
import { updateLeadStage } from '../services/leadService';

const cloneBoard = (source) => {
  const next = {};
  LEAD_STAGES.forEach((stage) => {
    next[stage] = [...(source[stage] || [])];
  });
  return next;
};

const applyMove = (source, leadId, fromStage, toStage) => {
  const next = cloneBoard(source);
  const fromList = next[fromStage];
  const leadIndex = fromList.findIndex((l) => l._id === leadId);
  if (leadIndex === -1) return source;

  const [lead] = fromList.splice(leadIndex, 1);
  next[fromStage] = fromList;
  next[toStage] = [...next[toStage], { ...lead, stage: toStage }];

  return next;
};

export const useKanbanBoard = (initialBoard, onSync) => {
  const [board, setBoard] = useState(() => cloneBoard(initialBoard || {}));
  const [activeLead, setActiveLead] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setBoard(cloneBoard(initialBoard || {}));
  }, [initialBoard]);

  const findLeadById = useCallback((id, sourceBoard = board) => {
    for (const stage of LEAD_STAGES) {
      const lead = sourceBoard[stage]?.find((l) => l._id === id);
      if (lead) return { lead, stage };
    }
    return null;
  }, [board]);

  const resolveStage = useCallback(
    (overId, sourceBoard = board) => {
      if (LEAD_STAGES.includes(overId)) return overId;
      const overLead = findLeadById(overId, sourceBoard);
      return overLead?.stage ?? null;
    },
    [board, findLeadById]
  );

  const handleDragStart = useCallback(
    (event) => {
      const found = findLeadById(event.active.id);
      if (found) setActiveLead(found.lead);
      setError(null);
    },
    [findLeadById]
  );

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      setActiveLead(null);

      if (!over) return;

      const found = findLeadById(active.id);
      if (!found) return;

      const newStage = resolveStage(over.id);
      if (!newStage || found.stage === newStage) return;

      const previousBoard = cloneBoard(board);
      const nextBoard = applyMove(board, active.id, found.stage, newStage);
      setBoard(nextBoard);

      setUpdating(true);
      try {
        await updateLeadStage(found.lead._id, newStage);
        onSync?.();
      } catch (err) {
        setBoard(previousBoard);
        setError(err.response?.data?.message || 'Failed to update lead stage');
      } finally {
        setUpdating(false);
      }
    },
    [board, findLeadById, resolveStage, onSync]
  );

  const handleDragCancel = useCallback(() => {
    setActiveLead(null);
  }, []);

  const columnTotals = LEAD_STAGES.reduce((acc, stage) => {
    const leads = board[stage] || [];
    acc[stage] = leads.reduce((sum, l) => sum + (l.value || 0), 0);
    return acc;
  }, {});

  const totalLeads = LEAD_STAGES.reduce(
    (sum, stage) => sum + (board[stage]?.length || 0),
    0
  );

  return {
    board,
    activeLead,
    updating,
    error,
    setError,
    columnTotals,
    totalLeads,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
};
