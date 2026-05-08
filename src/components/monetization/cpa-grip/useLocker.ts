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
  activate: () => void;
  forceComplete: () => void;
  reset: () => void;
}

const STORAGE_KEY = "gixmix_unlocked";

function checkStorage(lockerId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${lockerId}`);
    return stored === "true";
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
  const checkRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (checkRef.current) clearInterval(checkRef.current);
      if (safetyRef.current) clearTimeout(safetyRef.current);
    };
  }, []);

  const stopPolling = useCallback(() => {
    if (checkRef.current) {
      clearInterval(checkRef.current);
      checkRef.current = null;
    }
    if (safetyRef.current) {
      clearTimeout(safetyRef.current);
      safetyRef.current = null;
    }
  }, []);

  const complete = useCallback(() => {
    markStorage(lockerId);
    setUnlocked(true);
    setLoading(false);
    setError(null);
    stopPolling();
  }, [lockerId, stopPolling]);

  const forceComplete = useCallback(() => {
    complete();
  }, [complete]);

  const reset = useCallback(() => {
    clearStorage(lockerId);
    setUnlocked(false);
    setLoading(false);
    setError(null);
    stopPolling();
  }, [lockerId, stopPolling]);

  const detectCompletion = useCallback(() => {
    checkRef.current = setInterval(() => {
      const overlay = document.getElementById("of74hnxtcg");

      // If overlay exists and is hidden/removed, user completed the offer
      if (overlay && (overlay.style.display === "none" || !document.body.contains(overlay))) {
        complete();
        return;
      }

      // Look for CPA Grip locker root element (varies by locker)
      const lockerRoot = document.querySelector('[id^="bo"]');
      if (!lockerRoot && !overlay) {
        // Both overlay and locker root are gone - likely completed
        // But wait a bit to be sure
      }
    }, 1000);

    // Safety timeout after 10 minutes - don't auto-complete, just stop polling
    safetyRef.current = setTimeout(() => {
      if (checkRef.current) {
        clearInterval(checkRef.current);
        checkRef.current = null;
      }
      setLoading(false);
      setError("Offer verification timed out. Please click 'I've completed the offer' if you finished it.");
    }, 600000);
  }, [complete]);

  const activate = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      window.lck = false;

      const s = document.createElement("script");
      s.type = "text/javascript";
      s.src = `https://quartzfiles.com/script_include.php?id=${lockerId}`;
      s.onload = () => {
        detectCompletion();
      };
      s.onerror = () => {
        setError("Failed to load locker. Please try again.");
        setLoading(false);
      };
      document.head.appendChild(s);
    } catch (e) {
      setError("Failed to initialize locker");
      setLoading(false);
    }
  }, [lockerId, detectCompletion]);

  return { unlocked, loading, error, activate, forceComplete, reset };
}
