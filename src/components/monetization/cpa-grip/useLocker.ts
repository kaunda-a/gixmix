"use client";

import { useState, useEffect, useCallback, useRef } from "react";

declare global {
  interface Window {
    lck: boolean;
    of74hnxtcg: any;
    jQuery: any;
  }
}

interface UseLockerOptions {
  lockerId: string;
}

interface UseLockerReturn {
  unlocked: boolean;
  loading: boolean;
  error: string | null;
  progress: number;
  activate: () => void;
  forceComplete: () => void;
  reset: () => void;
}

const STORAGE_KEY = "gixmix_unlocked";

function checkStorage(lockerId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(`${STORAGE_KEY}_${lockerId}`) === "true";
  } catch {
    return false;
  }
}

function markStorage(lockerId: string) {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${lockerId}`, "true");
  } catch {}
}

function clearStorage(lockerId: string) {
  try {
    localStorage.removeItem(`${STORAGE_KEY}_${lockerId}`);
  } catch {}
}

export function useLocker({ lockerId }: UseLockerOptions): UseLockerReturn {
  const [unlocked, setUnlocked] = useState(() => checkStorage(lockerId));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollDelayRef = useRef(1000);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (safetyRef.current) clearTimeout(safetyRef.current);
    };
  }, []);

  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (safetyRef.current) {
      clearTimeout(safetyRef.current);
      safetyRef.current = null;
    }
    pollDelayRef.current = 1000;
  }, []);

  const complete = useCallback(() => {
    window.lck = true;
    markStorage(lockerId);
    if (mountedRef.current) {
      setUnlocked(true);
      setLoading(false);
      setError(null);
      setProgress(100);
    }
    stopPolling();
  }, [lockerId, stopPolling]);

  const forceComplete = useCallback(() => {
    complete();
  }, [complete]);

  const reset = useCallback(() => {
    clearStorage(lockerId);
    if (mountedRef.current) {
      setUnlocked(false);
      setLoading(false);
      setError(null);
      setProgress(0);
    }
    stopPolling();
  }, [lockerId, stopPolling]);

  const detectCompletion = useCallback(() => {
    pollDelayRef.current = 1000;

    const poll = () => {
      if (!mountedRef.current) return;

      // Strategy 1: Direct window.lck check (set by CPA Grip on completion)
      if (window.lck) {
        complete();
        return;
      }

      // Strategy 2: Overlay detection
      const overlay = document.getElementById("of74hnxtcg");
      if (overlay && (overlay.style.display === "none" || !document.body.contains(overlay))) {
        complete();
        return;
      }

      // Strategy 3: Check if overlay was removed entirely
      if (!overlay) {
        const lockerRoot = document.querySelector('[id^="bo"]');
        const lockerIframe = document.querySelector('iframe[src*="cpagrip"]');
        const lockerDiv = document.querySelector('div[class*="locker"]');
        if (!lockerRoot && !lockerIframe && !lockerDiv) {
          complete();
          return;
        }
      }

      // Exponential backoff: 1s -> 1.5s -> 2.25s -> 3.375s -> 5s (max)
      pollDelayRef.current = Math.min(pollDelayRef.current * 1.5, 5000);
      timerRef.current = setTimeout(poll, pollDelayRef.current);
    };

    timerRef.current = setTimeout(poll, pollDelayRef.current);

    // Safety timeout: show manual fallback after 3 minutes
    safetyRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setError("Still waiting for confirmation. If you completed an offer, click the button below to unlock.");
    }, 180000);
  }, [complete]);

  const activate = useCallback(() => {
    setLoading(true);
    setError(null);
    setProgress(25);

    try {
      window.lck = false;

      const s = document.createElement("script");
      s.type = "text/javascript";
      s.src = `https://quartzfiles.com/script_include.php?id=${lockerId}`;
      s.onload = () => {
        if (!mountedRef.current) return;
        setProgress(50);
        detectCompletion();
      };
      s.onerror = () => {
        if (!mountedRef.current) return;
        setProgress(0);
        setError(
          "The locker couldn't load — likely blocked by an ad-blocker or VPN. Please disable it for this site, or click 'I've completed the offer' after finishing."
        );
      };
      document.head.appendChild(s);
    } catch (e) {
      if (mountedRef.current) {
        setError("Failed to initialize locker. Please try again.");
        setLoading(false);
        setProgress(0);
      }
    }
  }, [lockerId, detectCompletion]);

  return { unlocked, loading, error, progress, activate, forceComplete, reset };
}
