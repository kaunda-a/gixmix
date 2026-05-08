"use client";

import { useEffect, useRef, useCallback } from "react";

interface BackgroundRippleProps {
  cellSize?: number;
  rippleDuration?: number;
  rippleColor?: string;
  maxOpacity?: number;
  decay?: number;
}

interface Ripple {
  x: number;
  y: number;
  startTime: number;
}

export default function BackgroundRipple({
  cellSize = 60,
  rippleDuration = 1500,
  rippleColor = "rgba(20, 184, 166, {alpha})",
  maxOpacity = 0.3,
  decay = 0.85,
}: BackgroundRippleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const colsRef = useRef(0);
  const rowsRef = useRef(0);

  const getColor = useCallback(
    (alpha: number) => rippleColor.replace("{alpha}", String(alpha)),
    [rippleColor]
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
      colsRef.current = Math.ceil(canvas.width / cellSize);
      rowsRef.current = Math.ceil(canvas.height / cellSize);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleInteraction = (clientX: number, clientY: number) => {
      const col = Math.floor(clientX / cellSize);
      const row = Math.floor(clientY / cellSize);
      ripplesRef.current.push({
        x: col,
        y: row,
        startTime: Date.now(),
      });
    };

    const handleClick = (e: MouseEvent) => {
      handleInteraction(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest("a, button, input, textarea, select"))
        return;
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.style.pointerEvents = "none";

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const now = Date.now();

      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        const elapsed = now - ripple.startTime;
        return elapsed < rippleDuration;
      });

      for (const ripple of ripplesRef.current) {
        const elapsed = now - ripple.startTime;
        const progress = elapsed / rippleDuration;
        const radius = progress * 8;

        for (let dr = -radius; dr <= radius; dr++) {
          for (let dc = -radius; dc <= radius; dc++) {
            const dist = Math.sqrt(dr * dr + dc * dc);
            if (dist > radius) continue;

            const cellX = ripple.x + dc;
            const cellY = ripple.y + dr;
            if (cellX < 0 || cellY < 0 || cellX >= colsRef.current || cellY >= rowsRef.current)
              continue;

            const waveInfluence = Math.max(0, 1 - dist / radius);
            const timePhase = Math.sin((progress - dist * 0.15) * Math.PI * 3);
            const alpha = Math.max(0, waveInfluence * timePhase * maxOpacity * (1 - progress * decay));

            if (alpha < 0.01) continue;

            ctx.fillStyle = getColor(alpha);
            ctx.fillRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cellSize, rippleDuration, getColor, maxOpacity, decay]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 2,
      }}
      aria-hidden="true"
    />
  );
}
