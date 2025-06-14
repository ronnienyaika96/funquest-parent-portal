
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface LetterTracingNavButtonsProps {
  currentIndex: number;
  totalLetters: number;
  prevLetter: () => void;
  nextLetter: () => void;
  isMobile: boolean;
}

const LetterTracingNavButtons: React.FC<LetterTracingNavButtonsProps> = ({
  currentIndex,
  totalLetters,
  prevLetter,
  nextLetter,
  isMobile
}) => (
  <div className={`${isMobile ? "mt-5" : "mt-6"} flex items-center justify-between gap-10 w-full px-6 max-w-xs mx-auto`}>
    <button
      className={`transition-all duration-100 disabled:opacity-40 rounded-full border-4 p-0 shadow-xl focus:outline-none
        ${currentIndex === 0
          ? "bg-gray-200 border-gray-300 cursor-default"
          : "bg-blue-600 hover:bg-blue-700 border-blue-700"}
        flex items-center justify-center`}
      disabled={currentIndex === 0}
      onClick={prevLetter}
      aria-label="Previous letter"
      style={{
        minWidth: 48, minHeight: 48, fontSize: 22,
        boxShadow: currentIndex === 0 ? 'none' : '0 2px 14px #60a5fad9'
      }}
    >
      <ArrowLeft size={32} color={currentIndex === 0 ? "#7dd3fc" : "#fff"} />
    </button>
    <button
      className={`transition-all duration-100 disabled:opacity-40 rounded-full border-4 p-0 shadow-xl focus:outline-none
        ${currentIndex === totalLetters - 1
          ? "bg-gray-200 border-gray-300 cursor-default"
          : "bg-orange-500 hover:bg-orange-600 border-orange-600"}
        flex items-center justify-center`}
      disabled={currentIndex === totalLetters - 1}
      onClick={nextLetter}
      aria-label="Next letter"
      style={{
        minWidth: 48, minHeight: 48, fontSize: 22,
        boxShadow: currentIndex === totalLetters - 1 ? 'none' : '0 2px 14px #fdba74d9'
      }}
    >
      <ArrowRight size={32} color={currentIndex === totalLetters - 1 ? "#fdba74" : "#fff"} />
    </button>
  </div>
);

export default LetterTracingNavButtons;
