import { useEffect } from 'react';

export function useKeyDown(handler: (key: string) => void) {
  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => handler(ev.key);
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handler]);
}
