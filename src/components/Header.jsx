import React from 'react';
import { Clock, Bookmark, LayoutGrid, Volume2, VolumeX, Shuffle, CheckCircle } from 'lucide-react';
import { formatTime } from '../utils/shuffle';

export default function Header({
  currentIndex,
  totalQuestions,
  elapsedTime,
  isFlagged,
  onToggleFlag,
  onOpenPalette,
  soundEnabled,
  onToggleSound,
  onFinishTest,
  isShuffled,
  answeredCount,
}) {
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <header className="flex-none bg-zinc-950 border-b border-zinc-850 px-3 sm:px-4 py-2 z-20 select-none">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Question counter & Timer */}
        <div className="flex items-center gap-2">
          {/* Question Counter */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-200">
            <span className="text-indigo-400 font-mono">Q</span>
            <span className="font-mono">{currentIndex + 1}</span>
            <span className="text-zinc-500 font-mono">/</span>
            <span className="text-zinc-400 font-mono">{totalQuestions}</span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg text-xs font-mono text-zinc-300">
            <Clock className="w-3 h-3 text-indigo-400" />
            <span>{formatTime(elapsedTime)}</span>
          </div>

          {/* Shuffled Badge (hidden on smallest screens to save space) */}
          {isShuffled && (
            <div 
              title="Questions are randomly shuffled"
              className="hidden xs:flex items-center gap-1 text-[11px] font-medium text-zinc-400 bg-zinc-900/60 border border-zinc-800/60 px-2 py-1 rounded-lg"
            >
              <Shuffle className="w-3 h-3 text-indigo-400" />
              <span className="hidden sm:inline">Shuffle</span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Flag / Bookmark */}
          <button
            onClick={onToggleFlag}
            title={isFlagged ? "Marked for review" : "Mark for review"}
            className={`p-1.5 sm:p-2 rounded-lg border transition text-xs flex items-center gap-1 ${
              isFlagged
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Question Palette */}
          <button
            onClick={onOpenPalette}
            title="Open Question Grid"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 transition text-xs flex items-center gap-1.5"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline font-mono">{answeredCount}/{totalQuestions}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? "Mute audio" : "Enable audio"}
            className="p-1.5 sm:p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-zinc-300" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-zinc-600" />
            )}
          </button>

          {/* Finish Test */}
          <button
            onClick={onFinishTest}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition flex items-center gap-1 active:scale-95"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Finish</span>
          </button>
        </div>
      </div>

      {/* 2px Progress bar directly below header */}
      <div className="w-full bg-zinc-900 h-1 mt-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
}
