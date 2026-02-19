import { useRef, useEffect } from 'react';
import { gsap } from '@/animations/gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';

interface BoxStepRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  placeholder: string;
  onPick: () => void;
  onChange: () => void;
}

const BoxStepRow = ({ icon, label, value, placeholder, onPick, onChange }: BoxStepRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const reducedMotion = prefersReducedMotion();
  const isSelected = !!value;

  useEffect(() => {
    if (!rowRef.current || reducedMotion || !isSelected) return;

    const row = rowRef.current;
    gsap.fromTo(
      row,
      { scale: 0.98, opacity: 0.8 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      }
    );

    // Subtle glow sweep
    const glow = row.querySelector('.glow-effect') as HTMLElement;
    if (glow) {
      gsap.fromTo(
        glow,
        { opacity: 0, x: -20 },
        {
          opacity: 0.3,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
        }
      );
    }
  }, [isSelected, reducedMotion]);

  return (
    <div
      ref={rowRef}
      className={`
        relative flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200
        ${isSelected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
        }
      `}
    >
      {/* Glow effect */}
      <div
        className="glow-effect absolute inset-0 bg-primary-500 rounded-lg opacity-0 pointer-events-none"
        style={{ filter: 'blur(8px)' }}
      />

      {/* Icon */}
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-primary-600 dark:text-primary-400">
        {icon}
      </div>

      {/* Label + Value */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          {label}
        </div>
        <div className={`font-semibold ${isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
          {value || placeholder}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={isSelected ? onChange : onPick}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          focus:outline-none
          ${isSelected
            ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-600 border border-primary-300 dark:border-primary-700'
            : 'bg-primary-500 text-white hover:bg-primary-600'
          }
        `}
      >
        {isSelected ? 'Change' : 'Pick'}
      </button>
    </div>
  );
};

export default BoxStepRow;
