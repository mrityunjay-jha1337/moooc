import React, { useState, useEffect, useRef, useCallback } from 'react';
import { questionsData } from './data/questions';
import { shuffleArray } from './utils/shuffle';
import { playClickSound } from './utils/sound';

import Header from './components/Header';
import QuestionCard from './components/QuestionCard';
import QuestionPalette from './components/QuestionPalette';
import ScoreScreen from './components/ScoreScreen';
import StartScreen from './components/StartScreen';
import ImageModal from './components/ImageModal';
import { AlertCircle } from 'lucide-react';

export default function App() {
  // App views: 'start' | 'quiz' | 'score'
  const [view, setView] = useState('start');

  // Configuration
  const [shuffleEnabled, setShuffleEnabled] = useState(true);
  const [questionCount, setQuestionCount] = useState(120);
  const [advanceDelay, setAdvanceDelay] = useState(180); // Fast, responsive 180ms
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active quiz state
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [index]: 'a' | 'b' | 'c' | 'd' }
  const [flagged, setFlagged] = useState(new Set());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);

  // Modals
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [zoomModal, setZoomModal] = useState({ isOpen: false, src: '', title: '' });

  const advanceTimeoutRef = useRef(null);

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (view === 'quiz') {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view]);

  // Clean timeout on unmount
  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  // Aggressive Image Preloader for Mobile Smoothness
  useEffect(() => {
    if (view !== 'quiz' || activeQuestions.length === 0) return;

    // Preload next 3 images and previous 1 image into browser cache
    const indicesToPreload = [
      currentIndex + 1,
      currentIndex + 2,
      currentIndex + 3,
      currentIndex - 1
    ];

    indicesToPreload.forEach((idx) => {
      if (idx >= 0 && idx < activeQuestions.length) {
        const img = new Image();
        img.src = activeQuestions[idx].image;
      }
    });
  }, [currentIndex, activeQuestions, view]);

  // Start test
  const handleStartQuiz = useCallback((customQuestions = null) => {
    let selected;
    if (customQuestions) {
      selected = shuffleEnabled ? shuffleArray(customQuestions) : [...customQuestions];
    } else {
      let pool = [...questionsData];
      if (shuffleEnabled) {
        pool = shuffleArray(pool);
      }
      selected = pool.slice(0, Math.min(questionCount, pool.length));
    }

    setActiveQuestions(selected);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged(new Set());
    setElapsedTime(0);
    setIsAdvancing(false);
    setView('quiz');
  }, [shuffleEnabled, questionCount]);

  // Retake missed questions only
  const handleRetakeIncorrect = useCallback(() => {
    const missed = activeQuestions.filter((q, idx) => {
      const userAns = answers[idx];
      return !userAns || userAns.toLowerCase() !== q.correctAnswer.toLowerCase();
    });

    if (missed.length > 0) {
      handleStartQuiz(missed);
    }
  }, [activeQuestions, answers, handleStartQuiz]);

  // Select Option and Auto-Advance
  const handleSelectOption = useCallback((optionKey) => {
    if (isAdvancing) return;

    playClickSound(soundEnabled);

    // Save answer
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionKey
    }));

    setIsAdvancing(true);

    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);

    advanceTimeoutRef.current = setTimeout(() => {
      setIsAdvancing(false);
      if (currentIndex < activeQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Last question answered! Automatically end test
        setView('score');
      }
    }, advanceDelay);
  }, [isAdvancing, soundEnabled, currentIndex, activeQuestions.length, advanceDelay]);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
      setIsAdvancing(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    setIsAdvancing(false);
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setConfirmSubmitOpen(true);
    }
  }, [currentIndex, activeQuestions.length]);

  const handleToggleFlag = useCallback(() => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentIndex)) {
        next.delete(currentIndex);
      } else {
        next.add(currentIndex);
      }
      return next;
    });
  }, [currentIndex]);

  const handleJumpToQuestion = useCallback((index) => {
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    setIsAdvancing(false);
    setCurrentIndex(index);
  }, []);

  const openZoomModal = (src, title) => {
    setZoomModal({
      isOpen: true,
      src: src || activeQuestions[currentIndex]?.image,
      title: title || `Question #${currentIndex + 1}`
    });
  };

  const closeZoomModal = () => {
    setZoomModal({ isOpen: false, src: '', title: '' });
  };

  // Keyboard shortcut support
  useEffect(() => {
    if (view !== 'quiz' || zoomModal.isOpen || confirmSubmitOpen || paletteOpen) {
      return;
    }

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'a' || key === '1') {
        e.preventDefault();
        handleSelectOption('a');
      } else if (key === 'b' || key === '2') {
        e.preventDefault();
        handleSelectOption('b');
      } else if (key === 'c' || key === '3') {
        e.preventDefault();
        handleSelectOption('c');
      } else if (key === 'd' || key === '4') {
        e.preventDefault();
        handleSelectOption('d');
      } else if (key === 'arrowleft') {
        e.preventDefault();
        handlePrev();
      } else if (key === 'arrowright') {
        e.preventDefault();
        handleNext();
      } else if (key === 'f') {
        e.preventDefault();
        handleToggleFlag();
      } else if (key === 'p') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, zoomModal.isOpen, confirmSubmitOpen, paletteOpen, handleSelectOption, handlePrev, handleNext, handleToggleFlag]);

  const currentQ = activeQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = activeQuestions.length - answeredCount;

  return (
    <div className="h-screen h-[100dvh] max-h-[100dvh] w-screen overflow-hidden bg-zinc-950 text-zinc-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. START SCREEN */}
      {view === 'start' && (
        <main className="flex-1 overflow-y-auto flex items-center justify-center p-3">
          <StartScreen
            totalAvailable={questionsData.length}
            questionCount={questionCount}
            setQuestionCount={setQuestionCount}
            shuffleEnabled={shuffleEnabled}
            setShuffleEnabled={setShuffleEnabled}
            advanceDelay={advanceDelay}
            setAdvanceDelay={setAdvanceDelay}
            onStart={() => handleStartQuiz()}
          />
        </main>
      )}

      {/* 2. QUIZ SCREEN (STRICT ZERO SCROLL 100dvh FIT) */}
      {view === 'quiz' && currentQ && (
        <div className="h-full w-full overflow-hidden flex flex-col justify-between">
          <Header
            currentIndex={currentIndex}
            totalQuestions={activeQuestions.length}
            elapsedTime={elapsedTime}
            isFlagged={flagged.has(currentIndex)}
            onToggleFlag={handleToggleFlag}
            onOpenPalette={() => setPaletteOpen(true)}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            onFinishTest={() => setConfirmSubmitOpen(true)}
            isShuffled={shuffleEnabled}
            answeredCount={answeredCount}
          />

          <main className="flex-1 min-h-0 w-full overflow-hidden flex flex-col px-2 sm:px-4 py-1.5 sm:py-2">
            <QuestionCard
              question={currentQ}
              currentIndex={currentIndex}
              totalQuestions={activeQuestions.length}
              selectedAnswer={answers[currentIndex]}
              onSelectOption={handleSelectOption}
              onPrev={handlePrev}
              onNext={handleNext}
              onOpenZoom={() => openZoomModal(currentQ.image, `Question #${currentIndex + 1}`)}
              isAdvancing={isAdvancing}
            />
          </main>

          <QuestionPalette
            isOpen={paletteOpen}
            onClose={() => setPaletteOpen(false)}
            totalQuestions={activeQuestions.length}
            currentIndex={currentIndex}
            answers={answers}
            flaggedQuestions={flagged}
            onJumpToQuestion={handleJumpToQuestion}
          />
        </div>
      )}

      {/* 3. SCORE SCREEN */}
      {view === 'score' && (
        <main className="flex-1 overflow-y-auto py-4">
          <ScoreScreen
            questions={activeQuestions}
            answers={answers}
            elapsedTime={elapsedTime}
            onRestart={() => handleStartQuiz()}
            onRetakeIncorrect={handleRetakeIncorrect}
            onOpenZoom={openZoomModal}
            soundEnabled={soundEnabled}
          />
        </main>
      )}

      {/* Confirmation Submit Modal */}
      {confirmSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-fade-in select-none">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-bold text-base text-zinc-100">Finish Test?</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Answered <span className="font-semibold text-emerald-400">{answeredCount}</span> of <span className="text-white font-semibold">{activeQuestions.length}</span> questions.
                {unansweredCount > 0 && (
                  <span className="text-rose-400 block mt-0.5">
                    {unansweredCount} remaining unanswered.
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmSubmitOpen(false)}
                className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-semibold transition"
              >
                Continue Test
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmSubmitOpen(false);
                  setView('score');
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition active:scale-95"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      <ImageModal
        isOpen={zoomModal.isOpen}
        onClose={closeZoomModal}
        imageSrc={zoomModal.src}
        title={zoomModal.title}
      />
    </div>
  );
}
