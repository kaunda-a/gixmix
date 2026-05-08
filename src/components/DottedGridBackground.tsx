"use client";

import { useEffect, useRef, useCallback } from "react";

interface DottedGridBackgroundProps {
  gridSize?: number;
  dotSize?: number;
  glowIntensity?: number;
  glowColor?: string;
  baseColor?: string;
}

export default function DottedGridBackground({
  gridSize = 40,
  dotSize = 1.5,
  glowIntensity = 0.6,
  glowColor = "rgba(20, 184, 166, {alpha})",
  baseColor = "rgba(150, 150, 160, {alpha})",
}: DottedGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const getGlowColor = useCallback(
    (alpha: number) => glowColor.replace("{alpha}", String(alpha)),
    [glowColor]
  );

  const getBaseColor = useCallback(
    (alpha: number) => baseColor.replace("{alpha}", String(alpha)),
    [baseColor]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / gridSize);
      const rows = Math.ceil(h / gridSize);
      const time = Date.now() / 1000;

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const x = c * gridSize;
          const y = r * gridSize;
          const dx = x - mouseRef.current.x;
          const dy = y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 150;

          const pulse = Math.sin(time * 1.5 + (x + y) * 0.02) * 0.5 + 0.5;

          if (dist < maxDist) {
            const glow = (1 - dist / maxDist) * glowIntensity;
            ctx.beginPath();
            ctx.arc(x, y, dotSize + glow * 3, 0, Math.PI * 2);
            ctx.fillStyle = getGlowColor(0.4 + glow * 0.6);
            ctx.fill();

            ctx.shadowColor = getGlowColor(glow);
            ctx.shadowBlur = glow * 20;
            ctx.beginPath();
            ctx.arc(x, y, dotSize + glow * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = getGlowColor(0.6 + glow * 0.4);
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            const alpha = (0.15 + pulse * 0.2) * 0.7;
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = getBaseColor(alpha);
            ctx.fill();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gridSize, dotSize, glowIntensity, getGlowColor, getBaseColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,
      }}
      aria-hidden="true"
    />
  );
}
