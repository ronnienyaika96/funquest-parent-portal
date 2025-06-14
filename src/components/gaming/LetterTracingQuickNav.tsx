
import React from "react";

interface LetterTracingQuickNavProps {
  alphabet: string[];
  currentIndex: number;
  onSelect: (idx: number) => void;
}

const LetterTracingQuickNav: React.FC<LetterTracingQuickNavProps> = ({
  alphabet,
  currentIndex,
  onSelect
}) => (
  <div className="mt-2 w-full px-2 flex flex-wrap justify-center gap-1">
    {alphabet.map((l, idx) => (
      <button
        key={l}
        className={`rounded-full m-1 px-3 py-2 font-extrabold text-lg border-2 hover:scale-105 transition bg-white/95 ${
          idx === currentIndex ? "bg-funquest-blue text-white border-funquest-blue scale-110 shadow-lg" : "border-gray-300 text-funquest-blue"
        }`}
        aria-label={`Jump to letter ${l.toUpperCase()}`}
        onClick={() => onSelect(idx)}
        style={{ minWidth: 38, minHeight: 38, fontSize: 18 }}
      >
        {l.toUpperCase()}
      </button>
    ))}
  </div>
);

export default LetterTracingQuickNav;
