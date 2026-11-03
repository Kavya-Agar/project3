import { useEffect } from 'react';

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'touchstart'];

// Calls `onIdle` after `timeoutMs` without interaction; disabled when `active` is false.
export function useIdleReset(active, timeoutMs, onIdle) {
  useEffect(() => {
    if (!active) return undefined;
    let timer;
    const restart = () => {
      clearTimeout(timer);
      timer = setTimeout(onIdle, timeoutMs);
    };
    restart();
    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, restart));
    return () => {
      clearTimeout(timer);
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, restart));
    };
  }, [active, timeoutMs, onIdle]);
}
