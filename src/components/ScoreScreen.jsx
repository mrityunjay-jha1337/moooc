import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  ZoomIn, 
  RefreshCw,
  RotateCcw,
  Award
} from 'lucide-react';
import { formatTime } from '../utils/shuffle';
import { playCompleteSound } from '../utils/sound';

export default function ScoreScreen({
  questions,
  answers,
  elapsedTime,
  onRestart,
  onRetakeIncorrect,
  onOpenZoom,
  soundEnabled,
}) {
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all' | 'correct' | 'incorrect' | 'skipped'
  const [visibleCount, setVisibleCount] = useState(16); // Batch display for mobile smoothness

  const total = questions.length;
  let correctCount = 0;
  let incorrectCount = 0;
  let skippedCount = 0;

  questions.forEach((q, idx) => {
    const userAns = answers[idx];
    if (!userAns) {
      skippedCount++;
    } else if (userAns.toLowerCase() === q.correctAnswer.toLowerCase()) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const percentage = Math.round((correctCount / total) * 100);
  const avgTimePerQuestion = Math.round(elapsedTime / (total || 1));

  useEffect(() => {
    playCompleteSound(soundEnabled);

    try {
      if (percentage >= 50) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      // Confetti fail-safe
    }
  }, [percentage, soundEnabled]);

  const getGrade = () => {
    if (percentage >= 90) return { title: 'Mastery Level! 🏆', color: 'text-amber-400' };
    if (percentage >= 75) return { title: 'Excellent Work! 🌟', color: 'text-emerald-400' };
    if (percentage >= 50) return { title: 'Passed! 👍', color: 'text-indigo-400' };
    return { title: 'Keep Practicing! 💪', color: 'text-rose-400' };
  };

  const grade = getGrade();

  // Filtered review list
  const reviewList = questions.map((q, idx) => {
    const userAns = answers[idx];
    const isCorrect = userAns && userAns.toLowerCase() === q.correctAnswer.toLowerCase();
    const isSkipped = !userAns;
    return {
      index: idx,
      question: q,
      userAns,
      isCorrect,
      isSkipped
    };
  }).filter((item) => {
    if (reviewFilter === 'correct') return item.isCorrect;
    if (reviewFilter === 'incorrect') return !item.isSkipped && !item.isCorrect;
    if (reviewFilter === 'skipped') return item.isSkipped;
    return true;
  });

  const displayedList = reviewList.slice(0, visibleCount);

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-6 flex flex-col gap-6 animate-fade-in select-none">
      {/* Result Card */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 sm:p-7 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-3">
          <Award className="w-7 h-7 text-indigo-400" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Test Completed
        </h1>
        <p className={`text-base font-bold mt-0.5 ${grade.color}`}>
          {grade.title}
        </p>

        {/* Big Score Display */}
        <div className="mt-4 flex flex-col items-center">
          <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
            {correctCount} <span className="text-xl sm:text-2xl font-normal text-zinc-500">/ {total}</span>
          </div>
          <div className="mt-1 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-0.5 rounded-full border border-indigo-500/20">
            {percentage}% Accuracy
          </div>
        </div>

        {/* 4 Quick Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-5">
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-2.5 flex flex-col items-center">
            <span className="text-xl font-bold text-emerald-400 font-mono">{correctCount}</span>
            <span className="text-[11px] text-zinc-400">Correct</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-2.5 flex flex-col items-center">
            <span className="text-xl font-bold text-rose-400 font-mono">{incorrectCount}</span>
            <span className="text-[11px] text-zinc-400">Incorrect</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-2.5 flex flex-col items-center">
            <span className="text-xl font-bold text-zinc-400 font-mono">{skippedCount}</span>
            <span className="text-[11px] text-zinc-500">Skipped</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-2.5 flex flex-col items-center">
            <span className="text-xl font-bold text-indigo-400 font-mono">{formatTime(elapsedTime)}</span>
            <span className="text-[11px] text-zinc-400">{avgTimePerQuestion}s/Q</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 w-full">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake (Reshuffle)</span>
          </button>

          {incorrectCount > 0 && (
            <button
              type="button"
              onClick={onRetakeIncorrect}
              className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 active:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Retry Missed ({incorrectCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Review Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">
            Question Review ({reviewList.length})
          </h2>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-lg text-xs">
            {[
              { id: 'all', label: `All (${total})` },
              { id: 'correct', label: `✓ (${correctCount})` },
              { id: 'incorrect', label: `✕ (${incorrectCount})` },
              { id: 'skipped', label: `— (${skippedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setReviewFilter(tab.id);
                  setVisibleCount(16);
                }}
                className={`px-2 py-1 rounded-md font-medium text-[11px] transition ${
                  reviewFilter === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Review Grid (Cards with lazy images) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayedList.map((item) => {
            const isCorrect = item.isCorrect;
            const isSkipped = item.isSkipped;
            const userAnsUpper = item.userAns ? item.userAns.toUpperCase() : 'None';
            const correctAnsUpper = item.question.correctAnswer.toUpperCase();

            let borderClass = isCorrect 
              ? 'border-emerald-500/40 bg-zinc-900/60' 
              : isSkipped 
              ? 'border-zinc-800 bg-zinc-900/40' 
              : 'border-rose-500/40 bg-zinc-900/60';

            return (
              <div
                key={item.index}
                className={`rounded-xl border p-3 flex flex-col justify-between gap-2.5 ${borderClass}`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-200">
                    Q #{item.index + 1} <span className="text-zinc-500 font-normal">(ID: {item.question.id})</span>
                  </span>
                  {isCorrect ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3 h-3" /> Correct
                    </span>
                  ) : isSkipped ? (
                    <span className="text-zinc-400 font-semibold flex items-center gap-1 text-[11px]">
                      <HelpCircle className="w-3 h-3" /> Skipped
                    </span>
                  ) : (
                    <span className="text-rose-400 font-semibold flex items-center gap-1 text-[11px]">
                      <XCircle className="w-3 h-3" /> Incorrect
                    </span>
                  )}
                </div>

                {/* Lazy thumbnail */}
                <div
                  onClick={() => onOpenZoom(item.question.image, `Q #${item.index + 1} (Orig #${item.question.id})`)}
                  className="relative cursor-zoom-in bg-zinc-950 rounded-lg p-1.5 flex items-center justify-center h-36 overflow-hidden border border-zinc-800"
                >
                  <img
                    src={item.question.image}
                    alt={`Question ${item.question.id}`}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                  <div className="absolute top-1.5 right-1.5 p-1 rounded bg-zinc-900/80 text-zinc-400 text-[10px]">
                    <ZoomIn className="w-3 h-3" />
                  </div>
                </div>

                {/* Answer comparison */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-zinc-800">
                  <div className={`p-1.5 rounded-lg flex flex-col ${
                    isCorrect 
                      ? 'bg-emerald-950/40 text-emerald-300' 
                      : isSkipped 
                      ? 'bg-zinc-800 text-zinc-400' 
                      : 'bg-rose-950/40 text-rose-300'
                  }`}>
                    <span className="text-[10px] text-zinc-400">Your Answer</span>
                    <span className="font-bold font-mono">Option {userAnsUpper}</span>
                  </div>

                  <div className="p-1.5 rounded-lg bg-emerald-950/40 text-emerald-300 flex flex-col">
                    <span className="text-[10px] text-zinc-400">Correct</span>
                    <span className="font-bold font-mono">Option {correctAnsUpper}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* "Load More" button for mobile smoothness */}
        {visibleCount < reviewList.length && (
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => Math.min(prev + 16, reviewList.length))}
            className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-xs font-semibold transition"
          >
            Show More ({reviewList.length - visibleCount} remaining)
          </button>
        )}
      </div>
    </div>
  );
}
