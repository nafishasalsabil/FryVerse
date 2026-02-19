import { useRef, useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useParallax } from '@/animations/useParallax';
import { gsap } from '@/animations/gsap.config';

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const friesRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);

  useParallax(heroRef, { speed: 0.3, direction: 'down' });

  useEffect(() => {
    if (!heroRef.current) return;

    // Set up Intersection Observer to detect when hero section enters viewport
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

    // Also check if already visible on mount
    const checkNow = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight + 100 && rect.bottom > -100;
        if (isVisible) {
          setShouldAutoplay(true);
          observer.disconnect();
        }
      }
    };

    // Check immediately and after a short delay to ensure DOM is ready
    checkNow();
    const timeoutId = setTimeout(checkNow, 100);

    const ctx = gsap.context(() => {
      // Animate blobs with optimized settings
      if (blob1Ref.current) {
        gsap.set(blob1Ref.current, { willChange: 'transform' });
        gsap.to(blob1Ref.current, {
          x: '+=50',
          y: '+=30',
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          force3D: true,
        });
      }
      if (blob2Ref.current) {
        gsap.set(blob2Ref.current, { willChange: 'transform' });
        gsap.to(blob2Ref.current, {
          x: '-=40',
          y: '-=20',
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          force3D: true,
        });
      }

      // Animate fries animation container
      if (friesRef.current) {
        gsap.set(friesRef.current, { willChange: 'transform' });
        gsap.to(friesRef.current, {
          y: -20,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          force3D: true,
        });
      }

      // Animate text
      if (textRef.current) {
        gsap.from(textRef.current.children, {
          opacity: 0,
          y: 30,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          force3D: true,
        });
      }
    }, heroRef);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background blobs */}
      <div
        ref={blob1Ref}
        data-parallax
        className="absolute top-20 left-10 w-96 h-96 bg-primary-200/30 dark:bg-primary-800/30 rounded-full blur-3xl"
      />
      <div
        ref={blob2Ref}
        data-parallax
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200/30 dark:bg-accent-800/30 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div ref={textRef} className="text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 text-balance">
              <span className="block">Choose your</span>
              <span className="block text-primary-600 dark:text-primary-400">fry personality.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              Discover 10 unique fry varieties, each with its own origin story, flavor profile, and perfect sauce pairing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#menu"
                className="btn-primary inline-flex items-center justify-center"
              >
                Explore Menu
              </a>
              <a
                href="#build-box"
                className="btn-outline inline-flex items-center justify-center"
              >
                Build Your Box
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div
              ref={friesRef}
              data-parallax
              className="w-full max-w-3xl"
            >
              {shouldAutoplay && (
                <DotLottieReact
                  key="fries-lottie"
                  src="/src/assets/French Fries/animations/12345.json"
                  loop={false}
                  autoplay={true}
                  style={{ width: '100%', height: 'auto', maxWidth: '800px' }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
