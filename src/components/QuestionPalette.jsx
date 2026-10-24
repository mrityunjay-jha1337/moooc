import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function QuestionPalette({
  isOpen,
  onClose,
  totalQuestions,
  currentIndex,
  answers,
  flaggedQuestions,
  onJumpToQuestion,
}) {
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flaggedQuestions.size;
  const unansweredCount = totalQuestions - answeredCount;

  const questionsList = Array.from({ length: totalQuestions }, (_, i) => i);

  const filteredQuestions = questionsList.filter((idx) => {
    const isAnswered = answers[idx] !== undefined;
    const isFlagged = flaggedQuestions.has(idx);
    if (filter === 'answered') return isAnswered;
    if (filter === 'unanswered') return !isAnswered;
    if (filter === 'flagged') return isFlagged;
    return true;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm h-full bg-zinc-950 border-l border-zinc-800 flex flex-col p-4 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h2 className="font-bold text-sm sm:text-base text-zinc-100">Question Palette</h2>
            <p className="text-[11px] text-zinc-500">{totalQuestions} Questions</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 my-3 text-xs">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-center">
            <span className="text-emerald-400 font-bold block">{answeredCount}</span>
            <span className="text-[10px] text-zinc-400">Done</span>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-center">
            <span className="text-zinc-300 font-bold block">{unansweredCount}</span>
            <span className="text-[10px] text-zinc-500">Left</span>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-center">
            <span className="text-amber-400 font-bold block">{flaggedCount}</span>
            <span className="text-[10px] text-zinc-400">Flagged</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-zinc-900 rounded-lg mb-3 border border-zinc-800 text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'answered', label: `Done (${answeredCount})` },
            { id: 'unanswered', label: `Left (${unansweredCount})` },
            { id: 'flagged', label: `Flag (${flaggedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`flex-1 py-1 rounded text-[11px] font-medium transition text-center ${
                filter === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Numbers Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-5 gap-1.5">
          {filteredQuestions.map((qIdx) => {
            const isAnswered = answers[qIdx] !== undefined;
            const isFlagged = flaggedQuestions.has(qIdx);
            const isCurrent = qIdx === currentIndex;

            let badgeClass = 'bg-zinc-900 text-zinc-300 border-zinc-800';
            if (isAnswered) {
              badgeClass = 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50';
            }
            if (isFlagged) {
              badgeClass = 'bg-amber-950/60 text-amber-300 border-amber-600/50';
            }

            return (
              <button
                key={qIdx}
                type="button"
                onClick={() => {
                  onJumpToQuestion(qIdx);
                  onClose();
                }}
                className={`h-9 rounded-lg font-bold text-xs flex flex-col items-center justify-center border transition relative active:scale-95 ${badgeClass} ${
                  isCurrent ? 'ring-2 ring-indigo-400 font-black' : ''
                }`}
              >
                <span>{qIdx + 1}</span>
                {isFlagged && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-zinc-800 text-[10px] text-center text-zinc-500">
          Tap number to jump
        </div>
      </div>
    </div>
  );
}
