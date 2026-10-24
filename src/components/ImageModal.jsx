import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';

export default function ImageModal({ isOpen, onClose, imageSrc, title }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const zoomIn = () => setScale(prev => Math.min(prev + 0.35, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.35, 0.7));
  const resetZoom = () => setScale(1);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full max-h-[95vh] bg-zinc-950 border border-zinc-800 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col items-center justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="w-full flex items-center justify-between pb-2 border-b border-zinc-850 text-zinc-200">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold truncate">
            <Maximize2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="truncate">{title || 'Image Preview'}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={zoomOut}
              title="Zoom Out"
              className="p-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-zinc-400 w-10 text-center font-mono">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={zoomIn}
              title="Zoom In"
              className="p-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              title="Reset Zoom"
              className="p-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Close"
              className="ml-1 p-1 rounded-md bg-red-600/30 hover:bg-red-600/50 text-red-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image viewport */}
        <div className="w-full flex-1 overflow-auto p-2 flex items-center justify-center my-1 max-h-[80vh]">
          <img
            src={imageSrc}
            alt="Question Full"
            style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
            className="max-h-[75vh] object-contain transition-transform duration-100 rounded select-none"
          />
        </div>

        <div className="w-full text-center text-[11px] text-zinc-500 pt-1.5 border-t border-zinc-900">
          Tap outside or buttons to close
        </div>
      </div>
    </div>
  );
}
