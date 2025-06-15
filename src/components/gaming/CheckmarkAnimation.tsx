
import React from "react";

const CheckmarkAnimation: React.FC = () => (
  <svg width="70" height="70" viewBox="0 0 70 70">
    <circle
      cx="35"
      cy="35"
      r="32"
      fill="#fff"
      stroke="#22c55e"
      strokeWidth="5"
      opacity="0.9"
    />
    <polyline
      points="22,36 32,50 50,24"
      fill="none"
      stroke="#22c55e"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ strokeDasharray: 48, strokeDashoffset: 48, animation: "checkmark 0.7s cubic-bezier(.56,2,.75,.92) forwards" }}
    />
    <style>
      {`
        @keyframes checkmark {
          to { stroke-dashoffset: 0; }
        }
      `}
    </style>
  </svg>
);
export default CheckmarkAnimation;
