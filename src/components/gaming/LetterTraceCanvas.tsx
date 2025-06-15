
import React, { useRef, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Utility
function distance(p1: {x:number, y:number}, p2: {x:number, y:number}) {
  const dx = p1.x - p2.x, dy = p1.y - p2.y;
  return Math.sqrt(dx*dx + dy*dy);
}

// Simple SVG path centroid
function getSvgPathPoints(svg: SVGElement | null) {
  if (!svg) return [];
  const paths = svg.querySelectorAll('path');
  if (!paths.length) return [];
  try {
    // Convert only the first path to points array (for simple letters)
    const path = paths[0];
    const length = path.getTotalLength();
    let pts: {x:number, y:number}[] = [];
    for (let i = 0; i <= length; i += Math.max(1, length/64)) {
      const pt = path.getPointAtLength(i);
      pts.push({ x: pt.x, y: pt.y });
    }
    return pts;
  } catch {
    return [];
  }
}

interface TraceCanvasProps {
  svgContent: string | null;
  svgBounds: { width: number; height: number };
  tracing: { x: number; y: number }[][];
  setTracing: React.Dispatch<React.SetStateAction<{ x: number; y: number }[][]>>;
  currentStroke: { x: number; y: number }[];
  setCurrentStroke: React.Dispatch<React.SetStateAction<{ x: number; y: number }[]>>;
  onSvgBoundsDetected: (bounds: { width: number; height: number }) => void;
  onTraceComplete: (result: "success"|"fail") => void;
}

const SMOOTH = 0.25; // Smoothing amount for polyline

const LetterTraceCanvas: React.FC<TraceCanvasProps> = ({
  svgContent,
  svgBounds,
  tracing,
  setTracing,
  currentStroke,
  setCurrentStroke,
  onSvgBoundsDetected,
  onTraceComplete,
}) => {
  const svgContainer = useRef<HTMLDivElement>(null);
  const ghostSvg = useRef<SVGSVGElement>(null); // Offscreen SVG for path extraction
  const [targetPoints, setTargetPoints] = useState<{x:number, y:number}[]>([]);
  const isMobile = useIsMobile();

  // On SVG loaded: extract path points
  useEffect(() => {
    if (!svgContent) return setTargetPoints([]);
    // Create a ghost SVG for parsing path
    const temp = document.createElement("div");
    temp.innerHTML = svgContent;
    const svg = temp.querySelector("svg");
    if (!svg) return setTargetPoints([]);
    setTargetPoints(getSvgPathPoints(svg));
    // Detect bounds
    const width = Number(svg.getAttribute('width')) || 320;
    const height = Number(svg.getAttribute('height')) || 320;
    onSvgBoundsDetected({ width, height });
    // eslint-disable-next-line
  }, [svgContent]);

  // Tracing - draw with straight/smoothened line
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
    // SMOOTH: only add point if far enough to avoid crumbled lines
    const last = currentStroke[currentStroke.length - 1];
    if (distance(last, { x, y }) > 4) {
      setCurrentStroke([...currentStroke, { x, y }]);
    }
  };

  // When user completes a stroke, compare with SVG path
  const handlePointerUp = (e: React.PointerEvent) => {
    if (currentStroke.length < 4) { // too short
      setCurrentStroke([]);
      if (svgContainer.current) svgContainer.current.releasePointerCapture(e.pointerId);
      onTraceComplete("fail");
      return;
    }
    setTracing((lines) => [...lines, currentStroke]);
    // Compare
    if (targetPoints.length > 0) {
      // Downsample user stroke to N points
      const user = resamplePolyline(currentStroke, 32);
      // Get a subset of the svg target path to the same length
      const target = resamplePolyline(targetPoints, 32);
      let matchRatio = 0;
      for (let i=0; i<user.length; ++i) {
        if (distance(user[i], target[i]) < 18) matchRatio++;
      }
      const score = matchRatio / user.length;
      setCurrentStroke([]);
      if (svgContainer.current) svgContainer.current.releasePointerCapture(e.pointerId);
      if (score > 0.7) {
        // Correct!
        onTraceComplete("success");
      } else {
        onTraceComplete("fail");
      }
      return;
    }
    setCurrentStroke([]);
    if (svgContainer.current) svgContainer.current.releasePointerCapture(e.pointerId);
  };

  function resamplePolyline(points: {x:number, y:number}[], count: number) {
    // Spread count samples evenly along the polyline
    if (points.length === 0) return [];
    let length = 0, dists = [0];
    for (let i = 1; i < points.length; i++) {
      length += distance(points[i-1], points[i]);
      dists.push(length);
    }
    if(length===0) return Array(count).fill(points[0]);
    let output = [];
    for (let i = 0; i < count; i++) {
      let t = (i/Math.max(count-1,1)) * length;
      // Find segment for t
      let idx = dists.findIndex(d => d >= t);
      if (idx === 0) output.push(points[0]);
      else if (idx === -1) output.push(points[points.length-1]);
      else {
        let t0 = dists[idx-1], t1 = dists[idx];
        let ratio = (t - t0) / (t1 - t0);
        let p = {
          x: points[idx-1].x + (points[idx].x - points[idx-1].x) * ratio,
          y: points[idx-1].y + (points[idx].y - points[idx-1].y) * ratio,
        };
        output.push(p);
      }
    }
    return output;
  }

  // To clear drawing externally
  useEffect(() => {
    if (tracing.length === 0 && currentStroke.length === 0) {
      onTraceComplete("reset");
    }
    // eslint-disable-next-line
  }, [tracing.length, currentStroke.length]);

  // Mobile touch drawing
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!svgContainer.current) return;
    const rect = svgContainer.current.getBoundingClientRect();
    const t = e.touches[0];
    let x = t.clientX - rect.left;
    let y = t.clientY - rect.top;
    setCurrentStroke([{ x, y }]);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!svgContainer.current || currentStroke.length === 0) return;
    const rect = svgContainer.current.getBoundingClientRect();
    const t = e.touches[0];
    let x = t.clientX - rect.left;
    let y = t.clientY - rect.top;
    const last = currentStroke[currentStroke.length - 1];
    if (distance(last, { x, y }) > 4) {
      setCurrentStroke([...currentStroke, { x, y }]);
    }
    e.preventDefault();
  };
  const handleTouchEnd = () => {
    if (currentStroke.length < 4) {
      setCurrentStroke([]);
      onTraceComplete("fail");
      return;
    }
    setTracing((lines) => [...lines, currentStroke]);
    if (targetPoints.length > 0) {
      const user = resamplePolyline(currentStroke, 32);
      const target = resamplePolyline(targetPoints, 32);
      let matchRatio = 0;
      for (let i=0; i<user.length; ++i) {
        if (distance(user[i], target[i]) < 18) matchRatio++;
      }
      const score = matchRatio / user.length;
      setCurrentStroke([]);
      if (score > 0.7) {
        onTraceComplete("success");
      } else {
        onTraceComplete("fail");
      }
      return;
    }
    setCurrentStroke([]);
  };

  // Polyline smoothing for "straight-like" trace
  function smoothPolyline(pts: {x:number, y:number}[], k=SMOOTH) {
    if (pts.length < 2) return pts;
    let result = [];
    result.push(pts[0]);
    for (let i = 1; i < pts.length; i++) {
      const prev = result[result.length-1];
      const curr = pts[i];
      result.push({
        x: prev.x * (1-k) + curr.x * k,
        y: prev.y * (1-k) + curr.y * k,
      });
    }
    return result;
  }

  // Enhance SVG: inject style for dark stroke and bright fill
  function enhanceSvg(raw: string | null) {
    if (!raw) return null;
    const STYLE = `
      <style>
        path, ellipse, circle, rect, polyline, polygon, g text {
          stroke: #1e1e1e !important;
          stroke-width: 4 !important;
          fill: #007bff !important;
        }
        text { fill: #007bff !important; }
        /* Dotted for guides */
        .dotted, [stroke-dasharray] { stroke-dasharray: 6 10 !important; }
      </style>`;
    if (raw.includes('<style>')) return raw;
    return raw.replace(/<svg([^>]*)>/, `<svg$1>${STYLE}`);
  }

  return (
    <div
      ref={svgContainer}
      className="relative letter-trace-canvas mx-auto flex items-center justify-center border-4 border-blue-300 bg-white"
      style={{
        width: isMobile ? '90vw' : '380px',
        height: isMobile ? '90vw' : '380px',
        maxWidth: isMobile ? 360 : 400,
        maxHeight: isMobile ? 360 : 400,
        aspectRatio: '1/1',
        boxShadow: isMobile
          ? "0 2px 18px #38bdf833"
          : '0 2px 24px 0px #bae6fd60',
        background: isMobile ? 'rgba(255,255,255,0.93)' : 'rgba(255,255,255,0.96)',
        padding: isMobile ? 8 : 18,
        overflow: 'hidden',
        touchAction: 'none'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Inline SVG Letter */}
      {svgContent ? (
        <div
          className="absolute inset-0 w-full h-full pointer-events-none select-none flex items-center justify-center"
          style={{ zIndex: 0, opacity: 1, filter: 'drop-shadow(0 0 12px #93c5fd)' }}
          dangerouslySetInnerHTML={{
            __html: enhanceSvg(svgContent) || "",
          }}
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
        style={{ zIndex: 1, overflow: 'visible', pointerEvents: 'none' }}
      >
        {tracing.map((stroke, i) => (
          <polyline
            key={i}
            points={smoothPolyline(stroke).map(p => `${p.x},${p.y}`).join(' ')}
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
            points={smoothPolyline(currentStroke).map(p => `${p.x},${p.y}`).join(' ')}
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
