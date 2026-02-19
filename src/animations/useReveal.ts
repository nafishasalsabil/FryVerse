import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from './gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';

interface UseRevealOptions {
  delay?: number;
  duration?: number;
  y?: number;
  opacity?: boolean;
  stagger?: number;
  trigger?: string | Element | null;
}

export const useReveal = (
  scopeRef: React.RefObject<HTMLElement>,
  options: UseRevealOptions = {}
) => {
  const {
    delay = 0,
    duration = 1,
    y = 50,
    opacity = true,
    stagger = 0.1,
    trigger,
  } = options;

  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (!scopeRef.current) return;

    const reducedMotion = prefersReducedMotion();
    const elements = scopeRef.current.querySelectorAll('[data-reveal]');

    if (elements.length === 0) return;

    ctxRef.current = gsap.context(() => {
      elements.forEach((el, index) => {
        const element = el as HTMLElement;
        const elementDelay = delay + index * stagger;

        if (reducedMotion) {
          gsap.set(element, { opacity: 0 });
          gsap.to(element, {
            opacity: 1,
            duration: 0.3,
            delay: elementDelay,
            ease: 'power2.out',
          });
        } else {
          gsap.set(element, {
            opacity: opacity ? 0 : 1,
            y: y,
          });

          ScrollTrigger.create({
            trigger: trigger || element,
            start: 'top 80%',
            animation: gsap.to(element, {
              opacity: 1,
              y: 0,
              duration,
              delay: elementDelay,
              ease: 'power3.out',
              force3D: true,
            }),
            once: true,
            markers: false,
          });
        }
      });
    }, scopeRef);

    return () => {
      ctxRef.current?.revert();
    };
  }, [scopeRef, delay, duration, y, opacity, stagger, trigger]);
};
