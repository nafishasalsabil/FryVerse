import { useRef } from 'react';
import { gsap } from '@/animations/gsap.config';
import { TRANSITION_DURATION } from '@/utils/constants';

export interface RouteTransitionHandle {
  startTransition: (onComplete?: () => void) => void;
  endTransition: (onComplete?: () => void) => void;
}

export const useRouteTransition = () => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const startTransition = (onComplete?: () => void) => {
    if (!overlayRef.current) return;

    const overlay = overlayRef.current.querySelector('div');
    if (!overlay) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    timelineRef.current = gsap.timeline({
      onComplete,
    });

    timelineRef.current.to(overlay, {
      clipPath: 'circle(150% at 50% 50%)',
      duration: TRANSITION_DURATION / 2,
      ease: 'power2.in',
    });
  };

  const endTransition = (onComplete?: () => void) => {
    if (!overlayRef.current) return;

    const overlay = overlayRef.current.querySelector('div');
    if (!overlay) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    timelineRef.current = gsap.timeline({
      onComplete,
    });

    timelineRef.current.to(overlay, {
      clipPath: 'circle(0% at 50% 50%)',
      duration: TRANSITION_DURATION / 2,
      ease: 'power2.out',
      delay: 0.1,
    });
  };

  return {
    overlayRef,
    startTransition,
    endTransition,
  };
};
