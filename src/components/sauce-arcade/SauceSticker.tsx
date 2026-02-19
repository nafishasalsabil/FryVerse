import { useRef, useState, useEffect } from 'react';
import { Sauce } from '@/data/sauces';
import { gsap } from '@/animations/gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';

interface SauceStickerProps {
  sauce: Sauce;
  onClick: () => void;
  isHighlighted?: boolean;
}

const SauceSticker = ({ sauce, onClick, isHighlighted = false }: SauceStickerProps) => {
  const stickerRef = useRef<HTMLButtonElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    if (!stickerRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      if (isHighlighted) {
        gsap.to(stickerRef.current, {
          scale: 1.05,
          boxShadow: '0 0 20px rgba(249, 115, 22, 0.5)',
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.to(stickerRef.current, {
          scale: 1,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    }, stickerRef);

    return () => ctx.revert();
  }, [isHighlighted, reducedMotion]);

  const handleMouseEnter = () => {
    if (reducedMotion) return;
    if (stickerRef.current) {
      gsap.to(stickerRef.current, {
        scale: 1.1,
        y: -4,
        boxShadow: '0 4px 16px rgba(249, 115, 22, 0.4)',
        duration: 0.2,
        ease: 'back.out(1.5)',
      });
    }
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;
    if (stickerRef.current) {
      gsap.to(stickerRef.current, {
        scale: isHighlighted ? 1.05 : 1,
        y: 0,
        boxShadow: isHighlighted
          ? '0 0 20px rgba(249, 115, 22, 0.5)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
        duration: 0.2,
        ease: 'power2.out',
      });
    }
  };

  const handleClick = () => {
    if (reducedMotion) {
      onClick();
      return;
    }

    if (stickerRef.current) {
      gsap.to(stickerRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
        onComplete: () => {
          onClick();
        },
      });
    } else {
      onClick();
    }

    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  const renderHeat = () => {
    return '🌶'.repeat(sauce.heat);
  };

  const getBadgeColor = () => {
    switch (sauce.badge) {
      case 'NEW':
        return 'bg-green-500 text-white';
      case 'BEST':
        return 'bg-yellow-500 text-white';
      case 'HOT':
        return 'bg-red-500 text-white';
      default:
        return '';
    }
  };

  return (
    <div className="relative inline-block">
      <button
        ref={stickerRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          relative px-4 py-2.5 rounded-full font-semibold text-sm
          transition-all duration-200
          ${isHighlighted
            ? 'bg-primary-500 text-white opacity-100'
            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 opacity-60'
          }
          border-2 border-gray-200 dark:border-gray-600
          shadow-md
          focus:outline-none
        `}
        aria-label={`${sauce.name} - ${sauce.shortNote}`}
        aria-describedby={showTooltip ? `tooltip-${sauce.id}` : undefined}
      >
        <div className="flex items-center gap-2">
          {sauce.badge && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${getBadgeColor()}`}>
              {sauce.badge}
            </span>
          )}
          <span>{sauce.name}</span>
        </div>
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
          style={{ mixBlendMode: 'overlay' }}
        />
      </button>

      {showTooltip && (
        <div
          id={`tooltip-${sauce.id}`}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-xl z-50 pointer-events-none"
          role="tooltip"
        >
          <div className="font-semibold mb-1">{sauce.shortNote}</div>
          <div className="text-gray-300 whitespace-nowrap">
            Best with {sauce.bestWith.join(' / ')} • Heat: {renderHeat()}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SauceSticker;
