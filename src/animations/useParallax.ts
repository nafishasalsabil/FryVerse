import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from './gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';

interface UseParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
  trigger?: string | Element | null;
  start?: string;
  end?: string;
}

export const useParallax = (
  scopeRef: React.RefObject<HTMLElement>,
  options: UseParallaxOptions = {}
) => {
  const {
    speed = 0.5,
    direction = 'up',
    trigger,
    start = 'top bottom',
    end = 'bottom top',
  } = options;

  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (!scopeRef.current) return;

    const reducedMotion = prefersReducedMotion();
    if (reducedMotion) return;

    const elements = scopeRef.current.querySelectorAll('[data-parallax]');

    if (elements.length === 0) return;

    ctxRef.current = gsap.context(() => {
      elements.forEach((el) => {
        const element = el as HTMLElement;
        const multiplier = direction === 'up' ? -speed : speed;

        // Add will-change for better performance
        gsap.set(element, { willChange: 'transform' });

        gsap.to(element, {
          y: `${multiplier * 100}%`,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: trigger || element,
            start,
            end,
            scrub: 0.5, // Smoother scrub with slight delay
            invalidateOnRefresh: true,
          },
        });
      });
    }, scopeRef);

    return () => {
      ctxRef.current?.revert();
    };
  }, [scopeRef, speed, direction, trigger, start, end]);
};
