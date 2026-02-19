import { useRef, useEffect } from 'react';
import { Sauce } from '@/data/sauces';
import { gsap } from '@/animations/gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';
import SauceSticker from './SauceSticker';

interface SauceMarqueeProps {
  sauces: Sauce[];
  highlightedSauceId?: string | null;
  onSauceClick: (sauce: Sauce) => void;
}

const SauceMarquee = ({ sauces, highlightedSauceId, onSauceClick }: SauceMarqueeProps) => {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const reducedMotion = prefersReducedMotion();

  // Split sauces into two rows
  const row1Sauces = sauces.filter((_, i) => i % 2 === 0);
  const row2Sauces = sauces.filter((_, i) => i % 2 === 1);

  useEffect(() => {
    if (!row1Ref.current || !row2Ref.current || !track1Ref.current || !track2Ref.current) return;
    if (reducedMotion) return;

    let animation1: gsap.core.Tween | null = null;
    let animation2: gsap.core.Tween | null = null;

    const setupAnimations = () => {
      const ctx = gsap.context(() => {
        // Get the width of one set of items
        const width1 = track1Ref.current!.scrollWidth / 2; // Divide by 2 because we duplicate
        const width2 = track2Ref.current!.scrollWidth / 2;

        // Row 1: Left direction (move negative)
        animation1 = gsap.to(track1Ref.current, {
          x: -width1,
          duration: width1 / 50,
          ease: 'none',
          repeat: -1,
          force3D: true,
        });

        // Row 2: Right direction (move positive, slightly different speed)
        animation2 = gsap.to(track2Ref.current, {
          x: width2,
          duration: width2 / 45,
          ease: 'none',
          repeat: -1,
          force3D: true,
        });
      }, row1Ref);

      return () => ctx.revert();
    };

    // Wait for layout to calculate widths correctly
    const timeoutId = setTimeout(setupAnimations, 150);

    return () => {
      clearTimeout(timeoutId);
      animation1?.kill();
      animation2?.kill();
    };
  }, [sauces, reducedMotion]);

  // Create duplicated sets for seamless loop (A + A pattern)
  const duplicatedRow1 = [...row1Sauces, ...row1Sauces];
  const duplicatedRow2 = [...row2Sauces, ...row2Sauces];

  return (
    <div className="relative">
      {/* Edge fade masks - must be above content but allow pointer events through */}
      {/* Light mode fades */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-32 z-20 pointer-events-none dark:hidden"
        style={{
          background: 'linear-gradient(to right, rgb(255, 255, 255), rgba(255, 255, 255, 0))',
        }}
      />
      <div 
        className="absolute right-0 top-0 bottom-0 w-32 z-20 pointer-events-none dark:hidden"
        style={{
          background: 'linear-gradient(to left, rgb(255, 255, 255), rgba(255, 255, 255, 0))',
        }}
      />
      {/* Dark mode fades */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-32 z-20 pointer-events-none hidden dark:block"
        style={{
          background: 'linear-gradient(to right, rgb(17, 24, 39), rgba(17, 24, 39, 0))',
        }}
      />
      <div 
        className="absolute right-0 top-0 bottom-0 w-32 z-20 pointer-events-none hidden dark:block"
        style={{
          background: 'linear-gradient(to left, rgb(17, 24, 39), rgba(17, 24, 39, 0))',
        }}
      />

      {/* Row 1: Left direction */}
      <div
        ref={row1Ref}
        className="relative overflow-hidden py-4"
        aria-hidden="false"
      >
        <div 
          ref={track1Ref}
          className="flex gap-4"
          style={{ willChange: 'transform' }}
        >
          {duplicatedRow1.map((sauce, index) => (
            <div key={`row1-${sauce.id}-${index}`} className="flex-shrink-0">
              <SauceSticker
                sauce={sauce}
                onClick={() => onSauceClick(sauce)}
                isHighlighted={highlightedSauceId === sauce.id}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Right direction */}
      <div
        ref={row2Ref}
        className="relative overflow-hidden py-4"
        aria-hidden="false"
      >
        <div 
          ref={track2Ref}
          className="flex gap-4"
          style={{ willChange: 'transform' }}
        >
          {duplicatedRow2.map((sauce, index) => (
            <div key={`row2-${sauce.id}-${index}`} className="flex-shrink-0">
              <SauceSticker
                sauce={sauce}
                onClick={() => onSauceClick(sauce)}
                isHighlighted={highlightedSauceId === sauce.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SauceMarquee;
