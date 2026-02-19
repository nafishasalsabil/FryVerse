import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from '@/animations/gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';
import CatchTheFriesGame from './CatchTheFriesGame';
import { useDiscount } from '@/contexts/DiscountContext';

interface CatchTheFriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDiscountApplied: (applied?: boolean) => void; // Optional: only called if game finished
}

const CatchTheFriesModal = ({ isOpen, onClose, onDiscountApplied }: CatchTheFriesModalProps) => {
  const [gameResult, setGameResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [discountAttempted, setDiscountAttempted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const { applyDiscount } = useDiscount();
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    let root = document.getElementById('minigame-portal-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'minigame-portal-root';
      document.body.appendChild(root);
    }
    setPortalRoot(root);

    return () => {
      if (root && root.children.length === 0 && root.parentNode) {
        root.parentNode.removeChild(root);
      }
    };
  }, []);

  useEffect(() => {
    if (!modalRef.current || !overlayRef.current) return;

    if (isOpen) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      );
      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(modalRef.current, { scale: 0.9, opacity: 0, duration: 0.2 });
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setGameResult(null);
      setShowResult(false);
      setDiscountAttempted(false);
    }
  }, [isOpen]);

  const calculateDiscount = (friesCaught: number): number => {
    if (friesCaught >= 21) return 10;
    if (friesCaught >= 11) return 5;
    return 2;
  };

  const getDiscountTier = (friesCaught: number): string => {
    if (friesCaught >= 21) return '10% OFF';
    if (friesCaught >= 11) return '5% OFF';
    return '2% OFF';
  };

  const handleGameEnd = (friesCaught: number) => {
    setGameResult(friesCaught);
    setShowResult(true);
  };

  const handleApplyDiscount = () => {
    if (gameResult === null) return;

    setDiscountAttempted(true);
    const percentOff = calculateDiscount(gameResult);
    applyDiscount({
      code: `MINIGAME-${Date.now()}`,
      percentOff,
      source: 'minigame',
      applied: true,
      friesCaught: gameResult,
    });

    // Confetti animation (if not reduced motion)
    if (!reducedMotion) {
      const confettiCount = 20;
      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'absolute w-2 h-2 bg-primary-500 rounded-full';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '0%';
        if (modalRef.current) {
          modalRef.current.appendChild(confetti);
          gsap.to(confetti, {
            y: '100%',
            x: (Math.random() - 0.5) * 200,
            rotation: 360,
            opacity: 0,
            duration: 1 + Math.random(),
            ease: 'power2.out',
            onComplete: () => {
              if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
              }
            },
          });
        }
      }
    }

    setTimeout(() => {
      onDiscountApplied(true); // Discount was applied
      onClose();
    }, reducedMotion ? 100 : 1500);
  };

  const handleClose = () => {
    if (showResult && !discountAttempted) {
      // If game finished but discount not applied, close without applying
      // This will trigger onDiscountAttempted callback to hide the button
      onDiscountApplied(false); // This signals that discount was attempted but not applied
    } else if (!showResult) {
      // Game not finished/not played, allow button to show again
      // Don't call onDiscountApplied so button remains visible
    }
    onClose();
  };

  if (!isOpen || !portalRoot) return null;

  const discount = gameResult !== null ? calculateDiscount(gameResult) : 0;
  const discountTier = gameResult !== null ? getDiscountTier(gameResult) : '';

  const modalContent = (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 z-[9998]"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-auto md:max-w-4xl lg:max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-[9999] p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto max-h-screen md:max-h-[95vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-100">
            Catch the Fries
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none flex-shrink-0"
            aria-label="Close game"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Game or Result */}
        {!showResult ? (
          <CatchTheFriesGame onGameEnd={handleGameEnd} />
        ) : (
          <div className="text-center py-4 sm:py-6 md:py-8">
            <div className="mb-4 sm:mb-6">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🎉</div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2">
                Game Over!
              </h3>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
                You caught <span className="text-primary-600 dark:text-primary-400 font-bold text-2xl sm:text-3xl">{gameResult}</span> fries!
              </p>
              <div className="mt-4 sm:mt-6 p-4 sm:p-5 md:p-6 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl border-2 border-primary-200 dark:border-primary-800 mx-auto max-w-md">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Your Reward</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary-600 dark:text-primary-400">
                  {discountTier}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {discount}% discount applied to your build
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button
                onClick={handleApplyDiscount}
                className="btn-primary px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
              >
                Apply Discount
              </button>
              <button
                onClick={handleClose}
                className="btn-outline px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
              >
                Close
              </button>
            </div>

            {/* <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3 sm:mt-4">
              One try per build
            </p> */}
          </div>
        )}
      </div>
    </>
  );

  return createPortal(modalContent, portalRoot);
};

export default CatchTheFriesModal;
