import { useEffect, useRef } from 'react';
import { gsap } from './gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';

interface UseMarqueeOptions {
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
}

export const useMarquee = (
  ref: React.RefObject<HTMLElement>,
  options: UseMarqueeOptions = {}
) => {
  const {
    speed = 1,
    direction = 'left',
    pauseOnHover = false,
  } = options;

  const ctxRef = useRef<gsap.Context | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const reducedMotion = prefersReducedMotion();
    if (reducedMotion) return;

    const content = ref.current.querySelector('[data-marquee-content]');
    if (!content) return;

    // Clone content for seamless loop
    const clone = content.cloneNode(true) as HTMLElement;
    clone.setAttribute('aria-hidden', 'true');
    ref.current.appendChild(clone);

    const width = content.scrollWidth;
    const directionMultiplier = direction === 'left' ? -1 : 1;

    ctxRef.current = gsap.context(() => {
      // Set will-change for performance
      gsap.set([content, clone], { willChange: 'transform', force3D: true });
      
      animationRef.current = gsap.to([content, clone], {
        x: `${directionMultiplier * width}px`,
        duration: width / (50 * speed),
        ease: 'none',
        repeat: -1,
        force3D: true,
      });

      if (pauseOnHover) {
        ref.current?.addEventListener('mouseenter', () => {
          animationRef.current?.pause();
        });
        ref.current?.addEventListener('mouseleave', () => {
          animationRef.current?.resume();
        });
      }
    }, ref);

    return () => {
      // Kill animation first to stop any ongoing animations
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
      
      // Revert GSAP context (this cleans up all GSAP-related DOM changes)
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
      
      // Safely remove clone - check if it still exists and is a child
      if (clone && ref.current && clone.parentNode === ref.current) {
        try {
          ref.current.removeChild(clone);
        } catch (e) {
          // Ignore if already removed or not a child
        }
      }
    };
  }, [ref, speed, direction, pauseOnHover]);
};
