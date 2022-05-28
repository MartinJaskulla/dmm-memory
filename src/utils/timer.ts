// https://www.youtube.com/watch?v=MCi6AZMkxcU
// https://gist.github.com/jakearchibald/cb03f15670817001b1157e62a076fe95

import { useEffect, useRef } from 'react';

// The timer pauses when switching to a different browser tab
export function animationInterval(ms: number, signal: AbortSignal, callback: (time: number) => void) {
  const start = document?.timeline?.currentTime || performance.now();

  function frame(time: number) {
    if (signal.aborted) return;
    callback(time);
    scheduleFrame(time);
  }

  function scheduleFrame(time: number) {
    const elapsed = time - start;
    const roundedElapsed = Math.round(elapsed / ms) * ms;
    const targetNext = start + roundedElapsed + ms;
    const delay = targetNext - performance.now();
    setTimeout(() => requestAnimationFrame(frame), delay);
  }

  scheduleFrame(start);
}

export function useAnimationInterval(ms: number, callback: (time: number) => void) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const controller = new AbortController();
    // This will always call the latest callback: https://gist.github.com/jakearchibald/cb03f15670817001b1157e62a076fe95?permalink_comment_id=3869687#gistcomment-3869687
    animationInterval(ms, controller.signal, (time) => callbackRef.current(time));
    return () => controller.abort();
  }, [ms]);
}

export function useEverySecond(callback: () => void) {
  useAnimationInterval(1000, callback);
}
