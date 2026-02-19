import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/animations/gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';
import { useDiscount } from '@/contexts/DiscountContext';
import CatchTheFriesModal from '@/components/minigame/CatchTheFriesModal';

interface BuildBarProps {
  selectedCut: string | null;
  selectedSeasoning: string | null;
  selectedSauce: string | null;
  onAddToCart: () => void;
  onScrollTo: (sectionId: string) => void;
}

const BuildBar = ({
  selectedCut,
  selectedSeasoning,
  selectedSauce,
  onAddToCart,
  onScrollTo,
}: BuildBarProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  const cutPillRef = useRef<HTMLButtonElement>(null);
  const seasoningPillRef = useRef<HTMLButtonElement>(null);
  const saucePillRef = useRef<HTMLButtonElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [discountAttemptedForBuild, setDiscountAttemptedForBuild] = useState(false);
  const reducedMotion = prefersReducedMotion();
  const { discount, clearDiscount } = useDiscount();

  const isComplete = !!(selectedCut && selectedSeasoning && selectedSauce);
  const completedCount = [selectedCut, selectedSeasoning, selectedSauce].filter(Boolean).length;

  // Reset discount attempt flag when build is reset (after adding to cart or when selections change)
  useEffect(() => {
    if (!isComplete) {
      setDiscountAttemptedForBuild(false);
    }
  }, [isComplete]);

  const getMissingStep = () => {
    if (!selectedCut) return 'cut';
    if (!selectedSeasoning) return 'seasoning';
    if (!selectedSauce) return 'sauce';
    return null;
  };

  const getCtaLabel = () => {
    if (showSuccess) return 'Added!';
    if (!isComplete) {
      const missing = getMissingStep();
      if (missing === 'cut') return 'Pick cut to start';
      if (missing === 'seasoning') return 'Pick seasoning';
      if (missing === 'sauce') return 'Pick sauce';
    }
    return 'Add to Cart';
  };

  // Animate pill on selection change
  useEffect(() => {
    if (reducedMotion) return;

    const refs = [cutPillRef, seasoningPillRef, saucePillRef];
    const values = [selectedCut, selectedSeasoning, selectedSauce];

    values.forEach((value, index) => {
      if (value && refs[index].current) {
        const pill = refs[index].current;
        gsap.fromTo(
          pill,
          { scale: 0.95 },
          {
            scale: 1,
            duration: 0.2,
            ease: 'power2.out',
          }
        );

        // Glow pulse
        gsap.to(pill, {
          boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)',
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
        });
      }
    });
  }, [selectedCut, selectedSeasoning, selectedSauce, reducedMotion]);

  // Animate CTA when enabled
  useEffect(() => {
    if (reducedMotion || !isComplete || !ctaRef.current) return;

    gsap.fromTo(
      ctaRef.current,
      { scale: 0.95, opacity: 0.8 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      }
    );
  }, [isComplete, reducedMotion]);

  const handleAddToCart = () => {
    if (!isComplete) return;

    if (!reducedMotion && ctaRef.current) {
      gsap.to(ctaRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    setDiscountAttemptedForBuild(false); // Reset when adding to cart
    onAddToCart();
  };

  const handlePillClick = (sectionId: string, ref: React.RefObject<HTMLButtonElement>) => {
    if (!reducedMotion && ref.current) {
      gsap.to(ref.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });
    }
    onScrollTo(sectionId);
  };

  // Icons
  const CutIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const SeasoningIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );

  const SauceIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );

  const Pill = ({
    icon,
    label,
    value,
    placeholder,
    onClick,
    pillRef,
    isSelected,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | null;
    placeholder: string;
    onClick: () => void;
    pillRef: React.RefObject<HTMLButtonElement>;
    isSelected: boolean;
  }) => (
    <button
      ref={pillRef}
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200
        focus:outline-none
        ${isSelected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-md'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
        }
      `}
      aria-label={`${label}: ${value || placeholder}`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <div className="flex flex-col items-start min-w-0">
        <span className="text-xs font-medium opacity-70">{label}</span>
        <span className={`text-sm font-semibold truncate ${isSelected ? '' : 'opacity-60'}`}>
          {value || placeholder}
        </span>
      </div>
      {isSelected && (
        <span className="text-xs text-primary-600 dark:text-primary-400 ml-1">Change</span>
      )}
    </button>
  );

  return (
    <>
      {/* Spacer to prevent content from being hidden behind the bar */}
      <div className="h-24 md:h-20" aria-hidden="true" />

      {/* Sticky Build Bar */}
      <div
        ref={barRef}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-lg"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-6 py-4">
            {/* Left: Title + Progress */}
            <div className="flex items-center gap-4 min-w-0">
              <h3 className="text-lg font-display font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                Build Bar
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {completedCount}/3 complete
                </span>
                <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all duration-300"
                    style={{ width: `${(completedCount / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Middle: Pills */}
            <div className="flex items-center gap-3 flex-1 justify-center">
              <Pill
                icon={<CutIcon />}
                label="Cut"
                value={selectedCut}
                placeholder="Pick cut"
                onClick={() => handlePillClick('cut', cutPillRef)}
                pillRef={cutPillRef}
                isSelected={!!selectedCut}
              />
              <Pill
                icon={<SeasoningIcon />}
                label="Seasoning"
                value={selectedSeasoning}
                placeholder="Pick seasoning"
                onClick={() => handlePillClick('seasoning', seasoningPillRef)}
                pillRef={seasoningPillRef}
                isSelected={!!selectedSeasoning}
              />
              <Pill
                icon={<SauceIcon />}
                label="Sauce"
                value={selectedSauce}
                placeholder="Pick sauce"
                onClick={() => handlePillClick('sauce', saucePillRef)}
                pillRef={saucePillRef}
                isSelected={!!selectedSauce}
              />
            </div>

            {/* Right: CTA + Game */}
            <div className="flex-shrink-0 flex items-center gap-3">
              {/* Discount Display */}
              {discount && discount.applied && (
                <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                  -{discount.percentOff}% off
                </div>
              )}
              
              {/* Play & Save Button */}
              {isComplete && !discount?.applied && !discountAttemptedForBuild && (
                <button
                  onClick={() => setIsGameModalOpen(true)}
                  className="px-4 py-2.5 rounded-lg font-semibold text-sm bg-accent-500 text-white hover:bg-accent-600 shadow-md transition-all duration-200 focus:outline-none flex items-center gap-2"
                  aria-label="Play mini-game to earn discount"
                >
                  <span>🎮</span>
                  <span className="hidden sm:inline">Play 20s</span>
                  <span className="hidden md:inline">→ Earn up to 10% off</span>
                </button>
              )}
              
              {/* Discount Unlocked Badge */}
              {discount && discount.applied && (
                <div className="px-4 py-2.5 rounded-lg font-semibold text-sm bg-green-500 text-white shadow-md flex items-center gap-2">
                  <span>✓</span>
                  <span>Discount unlocked</span>
                </div>
              )}
              
              {/* Add to Cart Button */}
              <button
                ref={ctaRef}
                onClick={handleAddToCart}
                disabled={!isComplete}
                aria-disabled={!isComplete}
                className={`
                  px-6 py-2.5 rounded-lg font-semibold transition-all duration-200
                  focus:outline-none
                  ${isComplete
                    ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }
                  ${showSuccess ? 'bg-green-500 hover:bg-green-600' : ''}
                `}
              >
                {getCtaLabel()}
              </button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden py-3 space-y-3">
            {/* Row 1: Progress + Actions */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <h3 className="text-base font-display font-bold text-gray-900 dark:text-gray-100">
                  Build Bar
                </h3>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {completedCount}/3
                </span>
                <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden max-w-24">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all duration-300"
                    style={{ width: `${(completedCount / 3) * 100}%` }}
                  />
                </div>
                {discount && discount.applied && (
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                    -{discount.percentOff}%
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Play & Save Button (Mobile) */}
                {isComplete && !discount?.applied && !discountAttemptedForBuild && (
                  <button
                    onClick={() => setIsGameModalOpen(true)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-accent-500 text-white hover:bg-accent-600 shadow-md transition-all duration-200 focus:outline-none flex items-center gap-1"
                    aria-label="Play mini-game"
                  >
                    <span>🎮</span>
                    <span>Play</span>
                  </button>
                )}
                <button
                  ref={ctaRef}
                  onClick={handleAddToCart}
                  disabled={!isComplete}
                  aria-disabled={!isComplete}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                    focus:outline-none
                    ${isComplete
                      ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }
                    ${showSuccess ? 'bg-green-500 hover:bg-green-600' : ''}
                  `}
                >
                  {getCtaLabel()}
                </button>
              </div>
            </div>

            {/* Row 2: Pills (horizontal scroll) */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
              <Pill
                icon={<CutIcon />}
                label="Cut"
                value={selectedCut}
                placeholder="Pick cut"
                onClick={() => handlePillClick('cut', cutPillRef)}
                pillRef={cutPillRef}
                isSelected={!!selectedCut}
              />
              <Pill
                icon={<SeasoningIcon />}
                label="Seasoning"
                value={selectedSeasoning}
                placeholder="Pick seasoning"
                onClick={() => handlePillClick('seasoning', seasoningPillRef)}
                pillRef={seasoningPillRef}
                isSelected={!!selectedSeasoning}
              />
              <Pill
                icon={<SauceIcon />}
                label="Sauce"
                value={selectedSauce}
                placeholder="Pick sauce"
                onClick={() => handlePillClick('sauce', saucePillRef)}
                pillRef={saucePillRef}
                isSelected={!!selectedSauce}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mini-game Modal */}
      <CatchTheFriesModal
        isOpen={isGameModalOpen}
        onClose={() => {
          setIsGameModalOpen(false);
        }}
        onDiscountApplied={(applied) => {
          setIsGameModalOpen(false);
          if (applied === false) {
            // Discount was attempted (game finished) but not applied (user closed without applying)
            // Only hide button if game was actually played and finished
            setDiscountAttemptedForBuild(true);
          }
          // If applied === undefined or game not played, don't hide the button
        }}
      />
    </>
  );
};

export default BuildBar;
