import React from 'react';
import { Play, Shuffle, Layers, Zap, Keyboard, Sparkles, Check } from 'lucide-react';

export default function StartScreen({
  totalAvailable,
  questionCount,
  setQuestionCount,
  shuffleEnabled,
  setShuffleEnabled,
  advanceDelay,
  setAdvanceDelay,
  onStart,
}) {
  const countOptions = [
    { count: 120, label: 'All 120 Questions' },
    { count: 50, label: '50 Questions' },
    { count: 20, label: '20 Questions' },
  ];

  const delayOptions = [
    { ms: 180, label: 'Fast (180ms)' },
    { ms: 300, label: 'Normal (300ms)' },
    { ms: 0, label: 'Instant (0ms)' },
  ];

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 sm:py-10 flex flex-col items-center gap-5 select-none animate-fade-in">
      {/* Title */}
      <div className="text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-3">
          <Sparkles className="w-3 h-3" />
          <span>Interactive Quiz</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Visual Quiz Master
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-sm">
          {totalAvailable} image questions with auto-advance & instant feedback.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
        {/* Shuffle Option */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Shuffle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-100">
                Random Shuffle
              </div>
              <p className="text-[11px] text-zinc-400">
                Randomize question order
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={shuffleEnabled}
              onChange={(e) => setShuffleEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Question Count Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-indigo-400" />
            <span>Questions:</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {countOptions.map((opt) => (
              <button
                key={opt.count}
                type="button"
                onClick={() => setQuestionCount(opt.count)}
                className={`p-2.5 rounded-xl border text-center transition-all text-xs font-medium ${
                  questionCount === opt.count
                    ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Auto-Advance Speed */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-indigo-400" />
            <span>Auto-Advance Speed:</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {delayOptions.map((opt) => (
              <button
                key={opt.ms}
                type="button"
                onClick={() => setAdvanceDelay(opt.ms)}
                className={`p-2 rounded-xl border text-center transition text-xs ${
                  advanceDelay === opt.ms
                    ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          type="button"
          onClick={onStart}
          className="w-full mt-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start Test ({questionCount} Questions)</span>
        </button>

        {/* Keyboard hint */}
        <div className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1.5">
          <Keyboard className="w-3 h-3" />
          <span>Desktop keys: A, B, C, D to answer • ← → to skip</span>
        </div>
      </div>
    </div>
  );
}
