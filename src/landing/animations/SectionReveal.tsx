import { useEffect, useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import './codrops-animations.css';

/**
 * Codrops enter animations for scroll sections.
 * @see https://tympanus.net/Development/PageTransitions/
 */
export type CodropsEnter =
  | 'moveFromBottom'
  | 'moveFromRight'
  | 'moveFromLeft'
  | 'moveFromTop'
  | 'moveFromBottomFade'
  | 'moveFromRightFade'
  | 'scaleUp'
  | 'scaleUpDown'
  | 'scaleUpCenter'
  | 'rotateRoomBottomIn'
  | 'rotateCubeBottomIn';

const ENTER_CLASS: Record<CodropsEnter, string> = {
  moveFromBottom: 'pt-page-moveFromBottom',
  moveFromRight: 'pt-page-moveFromRight',
  moveFromLeft: 'pt-page-moveFromLeft',
  moveFromTop: 'pt-page-moveFromTop',
  moveFromBottomFade: 'pt-page-moveFromBottomFade',
  moveFromRightFade: 'pt-page-moveFromRightFade',
  scaleUp: 'pt-page-scaleUp',
  scaleUpDown: 'pt-page-scaleUpDown',
  scaleUpCenter: 'pt-page-scaleUpCenter',
  rotateRoomBottomIn: 'pt-page-rotateRoomBottomIn',
  rotateCubeBottomIn: 'pt-page-rotateCubeBottomIn',
};

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  variant?: CodropsEnter;
};

export function SectionReveal({
  children,
  className = '',
  variant = 'moveFromBottom',
}: SectionRevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduce) return;

    const animClass = ENTER_CLASS[variant];

    // Start hidden until first play (mirrors Codrops page visibility)
    node.style.opacity = '0';

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || played.current) return;
        played.current = true;
        node.style.opacity = '1';
        node.classList.add(animClass);
        const onEnd = () => {
          node.classList.remove(animClass);
          node.removeEventListener('animationend', onEnd);
        };
        node.addEventListener('animationend', onEnd);
        io.disconnect();
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(node);
    return () => io.disconnect();
  }, [variant, reduce]);

  return (
    <div
      ref={ref}
      className={className}
      style={reduce ? undefined : { willChange: 'transform, opacity' }}
    >
      {children}
    </div>
  );
}
