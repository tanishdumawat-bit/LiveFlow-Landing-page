import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import './codrops-animations.css';

/**
 * Transition pairs from Codrops PageTransitions demo.
 * @see https://tympanus.net/Development/PageTransitions/
 */
const TRANSITIONS: { out: string; in: string; duration: number }[] = [
  { out: 'pt-page-moveToLeft', in: 'pt-page-moveFromRight', duration: 600 },
  { out: 'pt-page-moveToRight', in: 'pt-page-moveFromLeft', duration: 600 },
  { out: 'pt-page-moveToTop', in: 'pt-page-moveFromBottom', duration: 600 },
  { out: 'pt-page-moveToBottom', in: 'pt-page-moveFromTop', duration: 600 },
  { out: 'pt-page-fade', in: 'pt-page-moveFromRight pt-page-ontop', duration: 700 },
  { out: 'pt-page-moveToLeftFade', in: 'pt-page-moveFromRightFade', duration: 700 },
  { out: 'pt-page-moveToRightFade', in: 'pt-page-moveFromLeftFade', duration: 700 },
  { out: 'pt-page-moveToTopFade', in: 'pt-page-moveFromBottomFade', duration: 700 },
  { out: 'pt-page-scaleDown', in: 'pt-page-moveFromRight pt-page-ontop', duration: 700 },
  { out: 'pt-page-scaleDown', in: 'pt-page-moveFromLeft pt-page-ontop', duration: 700 },
  { out: 'pt-page-scaleDown', in: 'pt-page-moveFromBottom pt-page-ontop', duration: 700 },
  { out: 'pt-page-scaleDown', in: 'pt-page-scaleUpDown', duration: 700 },
  { out: 'pt-page-scaleDownUp', in: 'pt-page-scaleUp', duration: 500 },
  { out: 'pt-page-scaleDownCenter', in: 'pt-page-scaleUpCenter pt-page-delay300', duration: 700 },
  { out: 'pt-page-moveToLeftEasing pt-page-ontop', in: 'pt-page-scaleUp', duration: 700 },
  { out: 'pt-page-rotateRoomTopOut pt-page-ontop', in: 'pt-page-rotateRoomTopIn', duration: 800 },
  { out: 'pt-page-rotateRoomBottomOut pt-page-ontop', in: 'pt-page-rotateRoomBottomIn', duration: 800 },
  { out: 'pt-page-rotateCubeTopOut pt-page-ontop', in: 'pt-page-rotateCubeTopIn', duration: 600 },
  { out: 'pt-page-rotateCubeBottomOut pt-page-ontop', in: 'pt-page-rotateCubeBottomIn', duration: 600 },
];

type Active = {
  outClass: string;
  inClass: string;
  duration: number;
  key: number;
};

/**
 * Runs authentic Codrops page transitions on in-page nav jumps.
 */
export function HashPageTransition() {
  const reduce = useReducedMotion();
  const indexRef = useRef(0);
  const [active, setActive] = useState<Active | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    if (reduce) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor || busyRef.current) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;

      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();
      busyRef.current = true;

      const pair = TRANSITIONS[indexRef.current % TRANSITIONS.length]!;
      indexRef.current += 1;

      setActive({
        outClass: pair.out,
        inClass: pair.in,
        duration: pair.duration,
        key: indexRef.current,
      });

      // Mid-transition: jump to destination while pages animate
      window.setTimeout(() => {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        window.history.pushState(null, '', href);
      }, Math.min(280, pair.duration * 0.45));

      window.setTimeout(() => {
        setActive(null);
        busyRef.current = false;
      }, pair.duration + 80);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [reduce]);

  if (reduce || !active) return null;

  return (
    <div
      className="pt-perspective pointer-events-none fixed inset-0 z-[60]"
      aria-hidden="true"
      key={active.key}
    >
      {/* Outgoing page */}
      <div
        className={`pt-page pt-page-current ${active.outClass}`}
        style={{ background: '#FFFFFF' }}
      />
      {/* Incoming page */}
      <div
        className={`pt-page pt-page-current ${active.inClass}`}
        style={{ background: '#F5F6F8' }}
      />
    </div>
  );
}
