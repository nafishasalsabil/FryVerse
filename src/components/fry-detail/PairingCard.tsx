import { useRef } from 'react';
import { gsap } from '@/animations/gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';
import { Sauce } from '@/data/sauces';

interface PairingCardProps {
  sauce: Sauce;
  reason: string;
  onAddToBox: (sauceName: string) => void;
}

const PairingCard = ({ sauce, reason, onAddToBox }: PairingCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = prefersReducedMotion();

  const handleClick = () => {
    onAddToBox(sauce.name);
    if (!reducedMotion && cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseEnter = () => {
    if (!reducedMotion && cardRef.current) {
      gsap.to(cardRef.current, {
        y: -4,
        boxShadow: '0 10px 25px rgba(249, 115, 22, 0.2)',
        duration: 0.2,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    if (!reducedMotion && cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        duration: 0.2,
        ease: 'power2.out',
      });
    }
  };

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case 'spicy':
        return '🔥';
      case 'tangy':
        return '🍋';
      case 'creamy':
        return '🥛';
      case 'sweet':
        return '🍯';
      default:
        return '';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {sauce.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {reason}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {sauce.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-500 dark:text-gray-400"
                title={tag}
              >
                {getTagIcon(tag)}
              </span>
            ))}
            {sauce.heat > 2 && (
              <span className="text-xs text-red-500">
                {'🌶️'.repeat(sauce.heat)}
              </span>
            )}
          </div>
        </div>
        {sauce.badge && (
          <span className="badge-primary text-xs ml-2">{sauce.badge}</span>
        )}
      </div>
      <button
        onClick={handleClick}
        className="w-full btn-primary text-sm py-2"
      >
        Add to Box
      </button>
    </div>
  );
};

export default PairingCard;
