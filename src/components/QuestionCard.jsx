import React, { useState } from 'react';
import OptionButton from './OptionButton';
import { ZoomIn, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onSelectOption,
  onPrev,
  onNext,
  onOpenZoom,
  isAdvancing,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const options = ['a', 'b', 'c', 'd'];

  return (
    <div className="h-full w-full max-w-4xl mx-auto flex flex-col justify-between overflow-hidden">
      {/* Top micro info row */}
      <div className="flex-none flex items-center justify-between text-[11px] text-zinc-400 px-1 pb-1">
        <span className="font-medium text-zinc-300">
          Question #{currentIndex + 1}
          {question.id !== currentIndex + 1 && (
            <span className="text-zinc-500 ml-1">(ID: {question.id})</span>
          )}
        </span>
        <div className="flex items-center gap-1 text-indigo-400">
          <Sparkles className="w-3 h-3" />
          <span className="hidden xs:inline">Auto-advance on click</span>
        </div>
      </div>

      {/* Flexible Image Container (Shrinks/grows to fit exact leftover space) */}
      <div
        onClick={onOpenZoom}
        className="flex-1 min-h-0 relative flex items-center justify-center w-full overflow-hidden rounded-xl bg-zinc-900/70 border border-zinc-800/80 p-1 sm:p-2 cursor-zoom-in group my-1"
      >
        {/* Skeleton loading indicator */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
            <span className="text-zinc-600 text-xs font-mono">Loading...</span>
          </div>
        )}

        <img
          key={question.image}
          src={question.image}
          alt={`Question ${question.id}`}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onLoad={() => setImageLoaded(true)}
          className={`max-h-full max-w-full w-auto h-auto object-contain rounded-lg transition-opacity duration-150 select-none ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Minimal zoom overlay badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-zinc-950/80 border border-zinc-800 text-zinc-400 group-hover:text-zinc-200 text-[10px] flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
          <ZoomIn className="w-3 h-3 text-indigo-400" />
          <span className="hidden sm:inline">Tap to zoom</span>
        </div>

        {/* Subtle non-blocking advancing badge */}
        {isAdvancing && (
          <div className="absolute top-2 inset-x-0 flex justify-center pointer-events-none animate-fade-in">
            <div className="bg-zinc-950/90 border border-indigo-500/40 text-indigo-300 text-[11px] font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              <span>Next question...</span>
            </div>
          </div>
        )}
      </div>

      {/* 4 Options Grid (2x2 on mobile & desktop to keep height ultra-low) */}
      <div className="flex-none pt-1">
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {options.map((opt) => (
            <OptionButton
              key={opt}
              optionKey={opt}
              shortcutKey={opt.toUpperCase()}
              isSelected={selectedAnswer === opt}
              onSelect={onSelectOption}
            />
          ))}
        </div>
      </div>

      {/* Bottom Compact Navigation Bar */}
      <div className="flex-none flex items-center justify-between pt-2 px-0.5">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="h-8 sm:h-9 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-850 disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-800 text-zinc-300 text-xs font-medium transition flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        <span className="text-[11px] text-zinc-500 font-mono">
          Tap an option to advance
        </span>

        <button
          type="button"
          onClick={onNext}
          className="h-8 sm:h-9 px-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 text-xs font-medium transition flex items-center gap-1 active:scale-95"
        >
          <span>{currentIndex === totalQuestions - 1 ? 'Finish' : 'Skip'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
