import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from './gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';

interface UsePinnedSectionOptions {
  pinSpacing?: boolean;
  start?: string;
  end?: string;
  onStepChange?: (step: number) => void;
}

export const usePinnedSection = (
  scopeRef: React.RefObject<HTMLElement>,
  options: UsePinnedSectionOptions = {}
) => {
  const {
    pinSpacing = true,
    start = 'top top',
    end = '+=100%',
    onStepChange,
  } = options;

  const ctxRef = useRef<gsap.Context | null>(null);
  const stepRef = useRef<number>(0);

  useEffect(() => {
    if (!scopeRef.current) return;

    const reducedMotion = prefersReducedMotion();
    if (reducedMotion) return;

    const steps = scopeRef.current.querySelectorAll('[data-step]');

    if (steps.length === 0) return;

    ctxRef.current = gsap.context(() => {
      ScrollTrigger.create({
        trigger: scopeRef.current,
        start,
        end,
        pin: true,
        pinSpacing,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const newStep = Math.floor(progress * steps.length);
          
          if (newStep !== stepRef.current) {
            stepRef.current = newStep;
            onStepChange?.(newStep);

            // Update active step visual
            steps.forEach((step, index) => {
              const stepEl = step as HTMLElement;
              if (index === newStep) {
                stepEl.setAttribute('data-active', 'true');
              } else {
                stepEl.removeAttribute('data-active');
              }
            });
          }
        },
      });
    }, scopeRef);

    return () => {
      ctxRef.current?.revert();
    };
  }, [scopeRef, pinSpacing, start, end, onStepChange]);
};
