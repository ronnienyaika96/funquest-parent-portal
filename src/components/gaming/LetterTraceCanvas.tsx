
import React, { useRef, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TraceCanvasProps {
  svgContent: string | null;
  svgBounds: { width: number; height: number };
  tracing: { x: number; y: number }[][];
  setTracing: React.Dispatch<React.SetStateAction<{ x: number; y: number }[][]>>;
  currentStroke: { x: number; y: number }[];
  setCurrentStroke: React.Dispatch<React.SetStateAction<{ x: number; y: number }[]>>;
  onSvgBoundsDetected: (bounds: { width: number; height: number }) => void;
}

const LetterTraceCanvas: React.FC<TraceCanvasProps> = ({
  svgContent,
  svgBounds,
  tracing,
  setTracing,
  currentStroke,
  setCurrentStroke,
  onSvgBoundsDetected,
}) => {
  const svgContainer = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Parse svgBounds when SVG content changes
  useEffect(() => {
    if (!svgContent) return;
    try {
      const temp = document.createElement('div');
      temp.innerHTML = svgContent;
      const svg = temp.querySelector('svg');
      if (svg) {
        const width = Number(svg.getAttribute('width')) || 320;
        const height = Number(svg.getAttribute('height')) || 320;
        onSvgBoundsDetected({ width, height });
      }
    } catch {
      onSvgBoundsDetected({ width: 320, height: 320 });
    }
    // eslint-disable-next-line
  }, [svgContent]);

  // Tracing - draw on overlaid SVG
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!svgContainer.current) return;
    const rect = svgContainer.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    setCurrentStroke([{ x, y }]);
    svgContainer.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!svgContainer.current || currentStroke.length === 0) return;
    const rect = svgContainer.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    setCurrentStroke([...currentStroke, { x, y }]);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (currentStroke.length > 1) {
      setTracing((lines) => [...lines, currentStroke]);
    }
    setCurrentStroke([]);
    if (svgContainer.current) svgContainer.current.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={svgContainer}
      className="mx-auto my-6 md:my-10 relative bg-funquest-accent/10 rounded-[1.5rem] border-4 border-blue-300 pointer-events-auto touch-none overflow-hidden"
      style={{
        width: isMobile ? '90vw' : '380px',
        height: isMobile ? '90vw' : '380px',
        maxWidth: 400,
        maxHeight: 400,
        aspectRatio: '1/1',
        boxShadow: '0 2px 24px 0px #bae6fd60'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Background for the SVG letter to improve contrast */}
      <div 
        className="absolute inset-4 md:inset-6 bg-white/80 rounded-xl"
        style={{ zIndex: 0 }}
      />
      {/* Inline SVG Letter */}
      {svgContent ? (
        <div
          className="svg-letter-container absolute inset-0 w-full h-full pointer-events-none select-none flex items-center justify-center p-8 md:p-10"
          style={{ zIndex: 1 }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full" style={{ minHeight: 200 }}>
          <span className="text-2xl animate-pulse text-blue-400 font-bold">Loading...</span>
        </div>
      )}
      {/* Overlay SVG for tracing lines */}
      <svg
        width={svgBounds.width}
        height={svgBounds.height}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 2, overflow: 'visible' }}
      >
        {tracing.map((stroke, i) => (
          <polyline
            key={i}
            points={stroke.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={isMobile ? 16 : 10}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.85}
          />
        ))}
        {currentStroke.length > 1 && (
          <polyline
            points={currentStroke.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#2563eb"
            strokeWidth={isMobile ? 16 : 10}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.75}
          />
        )}
      </svg>
    </div>
  );
};

export default LetterTraceCanvas;
