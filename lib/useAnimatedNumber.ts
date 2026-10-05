"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 500;

/** Smoothly counts from the previous value to the new target (instant if the user prefers reduced motion). */
export function useAnimatedNumber(target: number): number {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);

  useEffect(() => {
    const from = displayRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduceMotion ? 0 : DURATION_MS;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + (target - from) * eased;
      displayRef.current = next;
      setDisplay(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return display;
}
