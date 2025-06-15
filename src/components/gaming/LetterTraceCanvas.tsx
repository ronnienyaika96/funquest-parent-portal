
import React, { useRef, useEffect } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const drawingRef = useRef(false);

  // Enhance SVG for background
  function enhanceSvg(raw: string | null) {
    if (!raw) return null;
    const STYLE = `
      <style>
        path, ellipse, circle, rect, polyline, polygon, g text {
          stroke: #1e1e1e !important;
          stroke-width: 4 !important;
          fill: #007bff !important;
        }
        text {
          fill: #007bff !important;
        }
      </style>`;
    if (raw.includes('<style>')) return raw;
    return raw.replace(/<svg([^>]*)>/, `<svg$1>${STYLE}`);
  }

  // SVG bounds extraction
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

  // Setup canvas size and clear when svgBounds change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = svgBounds.width;
    canvas.height = svgBounds.height;
    clearCanvas();
  }, [svgBounds.width, svgBounds.height, svgContent]);

  // Core Drawing Handlers
  function getRelativePos(e: any): { x: number; y: number } {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  function startDraw(e: any) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    drawingRef.current = true;
    const { x, y } = getRelativePos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e: any) {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.lineWidth = isMobile ? 16 : 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#007bff";
    const { x, y } = getRelativePos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDraw() {
    drawingRef.current = false;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) ctx.closePath();
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Attach and clean up listeners via React
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Mouse
    const handleMouseDown = (e: MouseEvent) => startDraw(e);
    const handleMouseMove = (e: MouseEvent) => draw(e);
    const handleMouseUp = () => stopDraw();
    const handleMouseOut = () => stopDraw();

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseout", handleMouseOut);

    // Touch
    const handleTouchStart = (e: TouchEvent) => startDraw(e);
    const handleTouchMove = (e: TouchEvent) => {
      draw(e);
      e.preventDefault();
    };
    const handleTouchEnd = () => stopDraw();

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseout", handleMouseOut);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
    // eslint-disable-next-line
  }, [isMobile, svgBounds.width, svgBounds.height]);

  // Clear drawing when svgContent changes
  useEffect(() => {
    clearCanvas();
  }, [svgContent]);

  // Expose clear method to parent if needed via tracing setter
  useEffect(() => {
    setTracing([]);
    setCurrentStroke([]);
    // eslint-disable-next-line
  }, [svgContent]);

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
    >
      {/* SVG Letter as background */}
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
      {/* Canvas Overlay for drawing */}
      <canvas
        id="trace-canvas"
        ref={canvasRef}
        width={svgBounds.width}
        height={svgBounds.height}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 2, touchAction: "none", background: "transparent" }}
      />
    </div>
  );
};

export default LetterTraceCanvas;
