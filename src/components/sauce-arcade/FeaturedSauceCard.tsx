import { useRef, useEffect } from 'react';
import { Sauce } from '@/data/sauces';
import { gsap } from '@/animations/gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';

interface FeaturedSauceCardProps {
  sauce: Sauce;
  onTryCombo: () => void;
}

const FeaturedSauceCard = ({ sauce, onTryCombo }: FeaturedSauceCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    if (!cardRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      // Sparkle animation
      if (sparkleRef.current) {
        gsap.to(sparkleRef.current, {
          rotation: 360,
          duration: 3,
          repeat: -1,
          ease: 'none',
        });
      }

      // Subtle pulse
      gsap.to(cardRef.current, {
        y: -2,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut',
      });
    }, cardRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleMouseEnter = () => {
    if (reducedMotion || !cardRef.current) return;
    gsap.to(cardRef.current, {
      y: -8,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (reducedMotion || !cardRef.current) return;
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const renderHeat = () => {
    return '🌶'.repeat(sauce.heat);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative max-w-md mx-auto bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border-2 border-primary-200 dark:border-primary-800 shadow-xl"
    >
      {/* Featured Badge */}
      <div className="absolute -top-3 left-6">
        <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          FEATURED
        </span>
      </div>

      {/* Sparkle accent */}
      {!reducedMotion && (
        <div
          ref={sparkleRef}
          className="absolute top-4 right-4 text-2xl opacity-30"
          aria-hidden="true"
        >
          ✨
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
            {sauce.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{sauce.shortNote}</p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-600 dark:text-gray-400">Heat:</span>
            <span className="text-lg">{renderHeat()}</span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Best with: <span className="font-semibold">{sauce.bestWith.join(' / ')}</span>
          </div>
        </div>

        <button
          onClick={onTryCombo}
          className="w-full btn-primary mt-4"
        >
          Try this combo
        </button>
      </div>
    </div>
  );
};

export default FeaturedSauceCard;
