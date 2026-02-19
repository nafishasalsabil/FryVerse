import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReveal } from '@/animations/useReveal';
import { CUT_TYPES, SEASONINGS } from '@/utils/constants';
import { useCart } from '@/contexts/CartContext';
import { useDiscount } from '@/contexts/DiscountContext';
import BuildBar from './builder/BuildBar';
import { getEmojiIcon } from '@/utils/emojiIcons';
import { gsap } from '@/animations/gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';

interface OptionCardProps {
  emoji: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const OptionCard = ({ emoji, label, isSelected, onClick }: OptionCardProps) => {
  const cardRef = useRef<HTMLButtonElement>(null);
  const emojiRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = prefersReducedMotion();

  const handleMouseEnter = () => {
    if (reducedMotion) return;
    
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -4,
        scale: 1.02,
        boxShadow: isSelected
          ? '0 8px 20px rgba(249, 115, 22, 0.4)'
          : '0 4px 12px rgba(249, 115, 22, 0.2)',
        duration: 0.2,
        ease: 'power2.out',
      });
    }
    
    if (emojiRef.current) {
      gsap.to(emojiRef.current, {
        y: -2,
        scale: 1.1,
        duration: 0.2,
        ease: 'back.out(1.7)',
      });
    }
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;
    
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        boxShadow: isSelected
          ? '0 4px 12px rgba(249, 115, 22, 0.3)'
          : '0 1px 3px rgba(0, 0, 0, 0.1)',
        duration: 0.2,
        ease: 'power2.out',
      });
    }
    
    if (emojiRef.current) {
      gsap.to(emojiRef.current, {
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    }
  };

  const handleClick = () => {
    if (!reducedMotion && cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });
    }
    
    if (!reducedMotion && emojiRef.current) {
      gsap.to(emojiRef.current, {
        scale: 1.2,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: 'back.out(1.7)',
      });
    }
    
    onClick();
  };

  return (
    <button
      ref={cardRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
        isSelected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-md'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700'
      } focus:outline-none`}
      style={{
        willChange: 'transform',
        boxShadow: isSelected
          ? '0 4px 12px rgba(249, 115, 22, 0.3)'
          : '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
      aria-label={label}
    >
      <span
        ref={emojiRef}
        className="text-4xl"
        aria-hidden="true"
        style={{ willChange: 'transform' }}
      >
        {emoji}
      </span>
      <div className="font-semibold text-center text-sm">{label}</div>
    </button>
  );
};

const BuildBox = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCut, setSelectedCut] = useState<string | null>(null);
  const [selectedSeasoning, setSelectedSeasoning] = useState<string | null>(null);
  const [selectedSauce, setSelectedSauce] = useState<string | null>(null);

  // Handle preselection from URL params (for "Try this combo")
  useEffect(() => {
    const cut = searchParams.get('cut');
    const seasoning = searchParams.get('seasoning');
    const sauce = searchParams.get('sauce');

    if (cut && CUT_TYPES.includes(cut)) {
      setSelectedCut(cut);
    }
    if (seasoning && SEASONINGS.includes(seasoning)) {
      setSelectedSeasoning(seasoning);
    }
    if (sauce) {
      // Check if sauce exists in the sauce options list (flexible matching)
      const sauceOptions = ['Ketchup', 'Ranch', 'BBQ', 'Maple Syrup', 'Buffalo', 'Garlic Aioli', 'Honey Mustard'];
      // Try exact match first
      if (sauceOptions.includes(sauce)) {
        setSelectedSauce(sauce);
      } else {
        // Try flexible matching (e.g., "Buffalo Sauce" -> "Buffalo")
        const matchedSauce = sauceOptions.find(opt => 
          sauce.toLowerCase().includes(opt.toLowerCase()) || 
          opt.toLowerCase().includes(sauce.toLowerCase())
        );
        if (matchedSauce) {
          setSelectedSauce(matchedSauce);
        }
      }
    }

    // Clear URL params after reading them
    if (cut || seasoning || sauce) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('cut');
      newParams.delete('seasoning');
      newParams.delete('sauce');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useReveal(sectionRef, { delay: 0.3 });

  const handleScrollTo = (sectionId: string) => {
    const element = document.querySelector(`[data-step-id="${sectionId}"]`);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const { addItem } = useCart();
  const { discount, clearDiscount, getDiscountedPrice } = useDiscount();
  const previousSelectionsRef = useRef<{ cut: string | null; seasoning: string | null; sauce: string | null }>({
    cut: null,
    seasoning: null,
    sauce: null,
  });
  const isComplete = !!(selectedCut && selectedSeasoning && selectedSauce);

  // Reset discount when build changes
  useEffect(() => {
    const current = { cut: selectedCut, seasoning: selectedSeasoning, sauce: selectedSauce };
    const previous = previousSelectionsRef.current;

    // Check if any selection changed
    if (
      (previous.cut || previous.seasoning || previous.sauce) && // Had selections before
      (current.cut !== previous.cut || current.seasoning !== previous.seasoning || current.sauce !== previous.sauce) && // Changed
      discount?.applied // Had discount
    ) {
      clearDiscount();
      // Show toast notification (simple implementation)
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-[10000]';
      toast.textContent = 'Build changed — discount reset';
      document.body.appendChild(toast);
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 3000);
    }

    previousSelectionsRef.current = current;
  }, [selectedCut, selectedSeasoning, selectedSauce, discount, clearDiscount]);

  const handleAddToCart = () => {
    if (!isComplete) return;

    const basePrice = 5.99;
    const finalPrice = getDiscountedPrice(basePrice);

    addItem({
      id: `custom-box-${Date.now()}`,
      name: 'Custom Fry Box',
      price: finalPrice,
      type: 'custom-box',
      customBox: {
        cut: selectedCut!,
        seasoning: selectedSeasoning!,
        sauce: selectedSauce!,
      },
    });

    // Reset selections and discount after adding to cart
    setSelectedCut(null);
    setSelectedSeasoning(null);
    setSelectedSauce(null);
    clearDiscount();
  };

  const steps = [
    {
      id: 'cut',
      title: 'Choose Your Cut',
      description: 'Select the perfect cut for your fry personality',
      options: CUT_TYPES,
      selected: selectedCut,
      setSelected: setSelectedCut,
    },
    {
      id: 'seasoning',
      title: 'Pick Your Seasoning',
      description: 'Add flavor that matches your mood',
      options: SEASONINGS,
      selected: selectedSeasoning,
      setSelected: setSelectedSeasoning,
    },
    {
      id: 'sauce',
      title: 'Select Your Sauce',
      description: 'The perfect finishing touch',
      options: ['Ketchup', 'Ranch', 'BBQ', 'Maple Syrup', 'Buffalo', 'Garlic Aioli', 'Honey Mustard'],
      selected: selectedSauce,
      setSelected: setSelectedSauce,
    },
  ];

  return (
    <section
      id="build-box"
      ref={sectionRef}
      className="relative bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 py-24 pb-32"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-reveal>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            Build Your Fry Box
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create your perfect combination in three simple steps.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-16">
          {steps.map((step, index) => (
            <div
              key={step.id}
              data-step={index}
              data-step-id={step.id}
              className="py-12"
              data-reveal
            >
              <div className="w-full">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500 text-white text-2xl font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {step.options.map((option) => {
                    const iconType = step.id === 'cut' ? 'cut' : step.id === 'seasoning' ? 'seasoning' : 'sauce';
                    const emoji = getEmojiIcon(iconType, option);
                    const isSelected = step.selected === option;
                    
                    return (
                      <OptionCard
                        key={option}
                        emoji={emoji}
                        label={option}
                        isSelected={isSelected}
                        onClick={() => {
                          // Toggle selection: if already selected, deselect; otherwise select
                          if (step.selected === option) {
                            step.setSelected(null);
                          } else {
                            step.setSelected(option);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Build Bar */}
      <BuildBar
        selectedCut={selectedCut}
        selectedSeasoning={selectedSeasoning}
        selectedSauce={selectedSauce}
        onAddToCart={handleAddToCart}
        onScrollTo={handleScrollTo}
      />
    </section>
  );
};

export default BuildBox;
