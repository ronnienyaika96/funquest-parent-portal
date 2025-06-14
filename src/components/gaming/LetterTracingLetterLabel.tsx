
import React from "react";
import { getLetterLabel } from "./letter-labels";

interface LetterTracingLetterLabelProps {
  letter: string;
}

const LetterTracingLetterLabel: React.FC<LetterTracingLetterLabelProps> = ({ letter }) => (
  <div className="text-center mb-2 mt-6">
    <span className="text-5xl font-extrabold drop-shadow text-funquest-blue" style={{
      letterSpacing: '0.08em',
      textShadow: "0px 4px 16px #a6e0ff"
    }}>
      {letter.toUpperCase()}
    </span>
    <span className="block text-lg font-medium text-funquest-green animate-pulse">{getLetterLabel(letter)}</span>
  </div>
);

export default LetterTracingLetterLabel;
