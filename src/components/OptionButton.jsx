import React from 'react';
import { Check } from 'lucide-react';

export default function OptionButton({
  optionKey,
  isSelected,
  onSelect,
  shortcutKey,
}) {
  const upperKey = optionKey.toUpperCase();

  return (
    <button
      type="button"
      onClick={() => onSelect(optionKey)}
      className={`relative w-full h-11 sm:h-13 px-3 rounded-xl border flex items-center justify-between transition-all duration-100 select-none active:scale-[0.98] ${
        isSelected
          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
          : 'bg-zinc-900/90 border-zinc-800 text-zinc-200 hover:border-zinc-700 active:bg-zinc-800'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {/* Letter Badge */}
        <span
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm transition-colors ${
            isSelected
              ? 'bg-white text-indigo-700'
              : 'bg-zinc-800 text-zinc-300'
          }`}
        >
          {upperKey}
        </span>

        {/* Text */}
        <span className="font-semibold text-xs sm:text-sm tracking-wide">
          Option {upperKey}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Desktop keyboard shortcut */}
        <span className="hidden sm:inline-block text-[10px] font-mono text-zinc-500 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60">
          {shortcutKey}
        </span>

        {/* Tick indicator */}
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-white text-indigo-600 scale-100'
              : 'border border-zinc-700/60 text-transparent scale-90'
          }`}
        >
          <Check className="w-3 h-3 stroke-[3]" />
        </div>
      </div>
    </button>
  );
}
