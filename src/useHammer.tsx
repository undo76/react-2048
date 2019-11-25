import { useEffect } from 'react';
import Hammer from 'hammerjs';

export function useHammer(handler: (gesture: string) => void) {
  useEffect(() => {
    function pd(e: Event) {
      e.preventDefault();
    }
    const opts: AddEventListenerOptions = {
      passive: false,
    };
    document.body.addEventListener('touchmove', pd, opts);

    const hc = new Hammer(document.body);
    hc.get('swipe').set({
      direction: Hammer.DIRECTION_ALL,
      threshold: 0,
      velocity: 0.1,
    });
    hc.on('swipeleft swiperight swipeup swipedown', ev => {
      handler(ev.type);
    });

    return () => {
      hc.destroy();
      document.body.removeEventListener('touchmove', pd, opts);
    };
  }, [handler]);
}
