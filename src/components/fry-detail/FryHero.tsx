import { useRef, useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { gsap } from '@/animations/gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';
import { Fry } from '@/data/fries';
import { formatPrice } from '@/utils/helpers';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTransition } from '@/contexts/TransitionContext';

interface FryHeroProps {
  fry: Fry;
  onBackToMenu: () => void;
}

const FryHero = ({ fry, onBackToMenu }: FryHeroProps) => {
  const heroRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { transitionRef } = useTransition();
  const [shouldAutoplay, setShouldAutoplay] = useState(false);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    if (!heroRef.current) return;

    // Set up Intersection Observer for Lottie
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldAutoplay(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(heroRef.current);

    // Check if already visible
    const checkNow = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
          setShouldAutoplay(true);
          observer.disconnect();
        }
      }
    };

    checkNow();
    const timeoutId = setTimeout(checkNow, 100);

    // Animate visual float
    if (!reducedMotion && visualRef.current) {
      gsap.set(visualRef.current, { willChange: 'transform' });
      gsap.to(visualRef.current, {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        force3D: true,
      });
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [reducedMotion]);

  const handleAddToCart = () => {
    addItem({
      id: `fry-${fry.slug}`,
      name: fry.name,
      price: fry.price,
      type: 'fry',
    });
  };

  const handleBuildBox = () => {
    // Preselect the current fry's cut type
    const preselectedCut = fry.cutType;

    if (transitionRef.current) {
      transitionRef.current.startTransition(() => {
        navigate(`/?cut=${encodeURIComponent(preselectedCut)}`);
        setTimeout(() => {
          transitionRef.current?.endTransition();
          setTimeout(() => {
            const buildBoxSection = document.getElementById('build-box');
            if (buildBoxSection) {
              buildBoxSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 500);
        }, 50);
      });
    } else {
      navigate(`/?cut=${encodeURIComponent(preselectedCut)}`);
      setTimeout(() => {
        const buildBoxSection = document.getElementById('build-box');
        if (buildBoxSection) {
          buildBoxSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative py-24 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              {/* Breadcrumb */}
              <button
                onClick={onBackToMenu}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Menu
              </button>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="badge-primary text-base px-4 py-2">{fry.cutType}</span>
                {fry.flavorTags.map((tag) => (
                  <span key={tag} className="badge-yellow text-base px-4 py-2">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
                {fry.name}
              </h1>

              {/* Tagline */}
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                {fry.shortDescription}
              </p>

              {/* Spice Level & Price */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 block mb-2">
                    Spice Level
                  </span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-4 h-4 rounded-full ${
                          level <= fry.spice
                            ? 'bg-red-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {fry.spice}/5
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 block mb-2">
                    Price
                  </span>
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {formatPrice(fry.price)}
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="btn-primary text-lg py-3 px-8"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuildBox}
                  className="btn-outline text-lg py-3 px-8"
                >
                  Build a Box with This
                </button>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative flex items-center justify-center">
              <div
                ref={visualRef}
                className="w-full max-w-md"
              >
                {shouldAutoplay && (
                  <DotLottieReact
                    key="fry-hero-lottie"
                    src="/src/assets/French Fries/animations/12345.json"
                    loop={false}
                    autoplay={true}
                    style={{ width: '100%', height: 'auto' }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FryHero;
