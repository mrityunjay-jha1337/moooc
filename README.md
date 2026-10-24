# 🎯 Visual Quiz Master (120 Image Questions)

React + Tailwind CSS interactive quiz website built for testing 120 visual questions located in `photos/` with answers defined in `photos/point.txt`.

---

## 🚀 How to Run the App

Open terminal in the project directory:

```bash
# Start development server
npm run dev

# Or build for production
npm run build
npm run preview
```

Open your browser at `http://localhost:3000` (or `http://localhost:5173`).

---

## ✨ Key Features

1. **🎲 True Random Shuffle**:
   - Uses the Fisher-Yates shuffle algorithm to randomize question order on each test.
   - Preserves original question numbers (e.g. "Question #14 (Original #58)") so you always know which file it corresponds to.
   - Option to toggle shuffle on/off on the start screen.

2. **⚡ Auto-Advance on Option Selection**:
   - Click any option (**A**, **B**, **C**, **D**) to automatically record your response and advance to the next question.
   - Adjustable auto-advance delay (Smooth 350ms, Fast 100ms, or Instant 0ms) from the start screen.
   - Smooth animation feedback and subtle synthesized audio clicks (toggleable).

3. **🔍 Full-Resolution Image Zoom Modal**:
   - Click on any question image to open an interactive modal with Zoom In, Zoom Out, and Reset Zoom to clearly read small formulas, diagrams, and text.

4. **⌨️ Comprehensive Keyboard Shortcuts**:
   - `A`, `B`, `C`, `D` or `1`, `2`, `3`, `4`: Select option & auto-advance
   - `←` / `→`: Previous / Next question
   - `F`: Flag / Bookmark question for review
   - `P`: Open / Close Question Palette
   - `Esc`: Close image zoom modal

5. **📊 Question Palette & Navigation**:
   - Interactive drawer showing all 120 question indicators.
   - Color coded:
     - 🟢 **Green**: Answered
     - 🟡 **Yellow**: Flagged for review
     - ⚪ **Slate**: Unanswered
     - 🟣 **Indigo**: Current question
   - Filter by All, Answered, Remaining, Flagged.
   - Instant click to jump to any question.

6. **🏆 Detailed Score & Performance Analysis**:
   - Visual celebration with dynamic confetti for high scores.
   - Accuracy percentage, total score, correct count, incorrect count, and skipped count.
   - Total time elapsed and average time spent per question.
   - **Detailed Question Review**:
     - Filter review by All, Correct, Incorrect, or Skipped.
     - View question image, your chosen answer, and the verified correct answer.
   - **Retake Missed Only**: Practice only the questions you got wrong until you achieve 100%!
   - **Retake Quiz (Reshuffle)**: Start a fresh test with a newly randomized question sequence.

7. **📱 100% Client-Side & Responsive**:
   - No backend required. All 120 `.webp` images are served directly from `public/photos/`.
   - Optimized for mobile phones, tablets, and desktop displays.
