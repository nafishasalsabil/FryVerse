import { useRef, useEffect } from 'react';
import { gsap } from '@/animations/gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';
import { Fry } from '@/data/fries';

interface FrySpecsProps {
  fry: Fry;
}

const FrySpecs = ({ fry }: FrySpecsProps) => {
  const crispinessRef = useRef<HTMLDivElement>(null);
  const fluffinessRef = useRef<HTMLDivElement>(null);
  const flavorRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = prefersReducedMotion();

  // Extract bite notes from textureNotes
  const getBiteNotes = () => {
    const notes = fry.textureNotes.toLowerCase();
    const biteNotes: string[] = [];
    
    if (notes.includes('crispy') || notes.includes('crisp')) {
      biteNotes.push('Snap');
    }
    if (notes.includes('fluffy') || notes.includes('tender')) {
      biteNotes.push('Fluffy');
    }
    if (notes.includes('golden') || notes.includes('caramelized')) {
      biteNotes.push('Golden Edge');
    }
    if (notes.includes('crunchy') || notes.includes('crunch')) {
      biteNotes.push('Crunch');
    }
    if (notes.includes('creamy')) {
      biteNotes.push('Creamy');
    }

    return biteNotes.length > 0 ? biteNotes : ['Perfect Bite', 'Satisfying', 'Delicious'];
  };

  useEffect(() => {
    if (!sectionRef.current || reducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate bars
            if (crispinessRef.current) {
              gsap.fromTo(
                crispinessRef.current,
                { width: 0 },
                { width: '90%', duration: 1, ease: 'power2.out' }
              );
            }
            if (fluffinessRef.current) {
              gsap.fromTo(
                fluffinessRef.current,
                { width: 0 },
                { width: '60%', duration: 1, ease: 'power2.out', delay: 0.2 }
              );
            }
            if (flavorRef.current) {
              gsap.fromTo(
                flavorRef.current,
                { width: 0 },
                { width: '85%', duration: 1, ease: 'power2.out', delay: 0.4 }
              );
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [reducedMotion]);

  const biteNotes = getBiteNotes();

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50 dark:bg-gray-950" data-reveal>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-8 text-center">
            Fry Specs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ingredients */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Ingredients
              </h3>
              <ul className="space-y-2">
                {fry.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bite Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Bite Notes
              </h3>
              <ul className="space-y-2">
                {biteNotes.map((note, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="text-primary-500">•</span>
                    <span className="font-medium">{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Texture Meters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Texture Profile
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Crispiness</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">High</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      ref={crispinessRef}
                      className="bg-primary-500 h-2 rounded-full"
                      style={reducedMotion ? { width: '90%' } : {}}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fluffiness</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Medium</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      ref={fluffinessRef}
                      className="bg-primary-500 h-2 rounded-full"
                      style={reducedMotion ? { width: '60%' } : {}}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Flavor Intensity</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">High</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      ref={flavorRef}
                      className="bg-primary-500 h-2 rounded-full"
                      style={reducedMotion ? { width: '85%' } : {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrySpecs;
