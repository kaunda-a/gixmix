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
  showWidget: boolean;
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
  const [showWidget, setShowWidget] = useState(false);
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
      setShowWidget(false);
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
      setShowWidget(false);
    }
    stopPolling();
  }, [lockerId, stopPolling]);

  const detectCompletion = useCallback(() => {
    pollDelayRef.current = 1000;

    const poll = () => {
      if (!mountedRef.current) return;

      if (window.lck) {
        complete();
        return;
      }

      const overlay = document.getElementById("of74hnxtcg");
      if (overlay && (overlay.style.display === "none" || !document.body.contains(overlay))) {
        complete();
        return;
      }

      if (!overlay) {
        const lockerRoot = document.querySelector('[id^="bo"]');
        const lockerIframe = document.querySelector('iframe[src*="cpagrip"]');
        const lockerDiv = document.querySelector('div[class*="locker"]');
        if (!lockerRoot && !lockerIframe && !lockerDiv) {
          complete();
          return;
        }
      }

      pollDelayRef.current = Math.min(pollDelayRef.current * 1.5, 5000);
      timerRef.current = setTimeout(poll, pollDelayRef.current);
    };

    timerRef.current = setTimeout(poll, pollDelayRef.current);

    safetyRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setError("Still waiting. If you completed the offer, click the button below.");
    }, 180000);
  }, [complete]);

  const activate = useCallback(() => {
    setLoading(true);
    setError(null);
    setShowWidget(true);

    // Use requestAnimationFrame to ensure the cpagrip div is mounted before loading script
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!mountedRef.current) return;

        try {
          window.lck = false;

          const existing = document.querySelector(`script[src*="script_include.php?id=${lockerId}"]`);
          if (existing) existing.remove();

          const s = document.createElement("script");
          s.type = "text/javascript";
          s.src = `https://quartzfiles.com/script_include.php?id=${lockerId}`;
          s.onload = () => {
            if (mountedRef.current) detectCompletion();
          };
          s.onerror = () => {
            if (!mountedRef.current) return;
            setError("Locker blocked by ad-blocker or VPN. Click 'I've completed the offer' after finishing.");
          };
          document.head.appendChild(s);
        } catch (e) {
          if (mountedRef.current) {
            setError("Failed to initialize locker");
            setLoading(false);
          }
        }
      });
    });
  }, [lockerId, detectCompletion]);

  return { unlocked, loading, error, showWidget, activate, forceComplete, reset };
}
