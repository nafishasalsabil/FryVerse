import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/animations/gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';

interface SpiceSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

const spiceLabels = ['Mild', 'Warm', 'Hot', 'Fire', 'Inferno'];

const SpiceSelector = ({
  value,
  onChange,
  min = 1,
  max = 5,
  size = 'md',
}: SpiceSelectorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;

    ctxRef.current = gsap.context(() => {
      // Cleanup on unmount
    }, containerRef.current);

    return () => {
      ctxRef.current?.revert();
    };
  }, []);

  const handleClick = (level: number, index: number) => {
    onChange(level);

    if (reducedMotion) return;

    const segment = segmentRefs.current[index];
    if (!segment) return;

    // Pop animation on click
    gsap.to(segment, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentLevel: number) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const newValue = Math.max(min, currentLevel - 1);
      onChange(newValue);
      setFocusedIndex(newValue - min);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const newValue = Math.min(max, currentLevel + 1);
      onChange(newValue);
      setFocusedIndex(newValue - min);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(currentLevel);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (reducedMotion) return;

    const segment = segmentRefs.current[index];
    if (!segment) return;

    gsap.to(segment, {
      y: -2,
      scale: 1.02,
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.25)',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (index: number) => {
    if (reducedMotion) return;

    const segment = segmentRefs.current[index];
    if (!segment) return;

    gsap.to(segment, {
      y: 0,
      scale: 1,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const levels = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const segmentSize = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div
          ref={containerRef}
          role="radiogroup"
          aria-label="Maximum Spice Level Selector"
          className="inline-flex gap-1.5"
        >
          {levels.map((level, index) => {
            const isActive = level <= value;
            const isFocused = focusedIndex === index;

            return (
              <button
                key={level}
                ref={(el) => {
                  segmentRefs.current[index] = el;
                }}
                type="button"
                role="radio"
                aria-checked={isActive}
                aria-label={`Spice level ${level}: ${spiceLabels[level - 1]}`}
                tabIndex={isFocused || (index === 0 && focusedIndex === null) ? 0 : -1}
                onClick={() => handleClick(level, index)}
                onKeyDown={(e) => handleKeyDown(e, level)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                className={`
                  ${segmentSize}
                  relative flex flex-col items-center justify-center gap-0.5
                  rounded-lg border-2 font-semibold transition-colors duration-200
                  focus:outline-none
                  ${isActive
                    ? 'border-primary-500 bg-primary-500 text-white shadow-md'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 opacity-60'
                  }
                `}
                style={{
                  willChange: 'transform',
                  boxShadow: isActive
                    ? '0 2px 8px rgba(249, 115, 22, 0.3)'
                    : '0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* Chili icon - single icon for all levels, or show multiplier for high levels */}
                <div className="flex items-center justify-center">
                  {level <= 3 ? (
                    Array.from({ length: level }).map((_, i) => (
                      <svg
                        key={i}
                        className={iconSize}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
                      </svg>
                    ))
                  ) : (
                    <div className="flex items-center gap-0.5">
                      <svg
                        className={iconSize}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
                      </svg>
                      <span className={`${textSize} font-bold`}>×{level}</span>
                    </div>
                  )}
                </div>
                <span className={`${textSize} font-bold leading-none`}>{level}</span>
              </button>
            );
          })}
        </div>

        {/* Compact status pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-full">
          <span className="text-xs text-gray-600 dark:text-gray-400">Max spice:</span>
          <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
            {spiceLabels[value - 1]}
          </span>
          <span className="text-xs text-primary-500 dark:text-primary-400">
            ({value}/5)
          </span>
        </div>
      </div>

      {/* Subtle hint text */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Up to this level
      </p>
    </div>
  );
};

export default SpiceSelector;
