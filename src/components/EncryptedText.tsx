"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface EncryptedTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  speed?: number;
  chars?: string;
  triggerOnHover?: boolean;
  triggerOnView?: boolean;
  delay?: number;
}

const DEFAULT_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export default function EncryptedText({
  text,
  className = "",
  as: Tag = "span",
  speed = 50,
  chars = DEFAULT_CHARS,
  triggerOnHover = true,
  triggerOnView = true,
  delay = 0,
}: EncryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    setIsAnimating(true);

    const length = text.length;
    let frame = 0;
    const maxFrames = Math.max(10, Math.floor(60 / (speed / 10)));

    intervalRef.current = setInterval(() => {
      frame++;
      let result = "";

      for (let i = 0; i < length; i++) {
        if (text[i] === " ") {
          result += " ";
          continue;
        }

        const revealProgress = Math.min(1, frame / maxFrames);
        const charThreshold = i / length;

        if (revealProgress > charThreshold && frame > i * 0.3) {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setDisplayText(result);

      if (frame >= maxFrames + length * 0.3) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsAnimating(false);
      }
    }, speed);
  }, [text, speed, chars]);

  useEffect(() => {
    if (!triggerOnView || hasAnimated.current) return;

    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timeoutRef.current = setTimeout(() => {
              animate();
            }, delay);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [triggerOnView, animate, delay]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (triggerOnHover && !hasAnimated.current) {
      animate();
    }
  };

  return (
    <Tag
      ref={elementRef as any}
      className={className}
      onMouseEnter={handleMouseEnter}
      style={{ cursor: triggerOnHover ? "pointer" : undefined }}
    >
      {displayText}
    </Tag>
  );
}
