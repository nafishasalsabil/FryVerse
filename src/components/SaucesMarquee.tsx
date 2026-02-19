import { useRef } from 'react';
import { useMarquee } from '@/animations/useMarquee';
import { useReveal } from '@/animations/useReveal';
import { SAUCES } from '@/utils/constants';

const SaucesMarquee = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useMarquee(marqueeRef, { speed: 1, direction: 'left' });
  useReveal(sectionRef);

  return (
    <section
      id="sauces"
      ref={sectionRef}
      className="py-24 bg-white dark:bg-gray-900 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-reveal>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            Our Sauces
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Every fry deserves the perfect sauce pairing.
          </p>
        </div>

        <div
          ref={marqueeRef}
          className="flex whitespace-nowrap overflow-hidden"
          aria-hidden="true"
        >
          <div data-marquee-content className="flex gap-8">
            {[...SAUCES, ...SAUCES].map((sauce, index) => (
              <div
                key={`${sauce}-${index}`}
                className="inline-flex items-center px-6 py-3 bg-primary-100 dark:bg-primary-900 rounded-full text-primary-700 dark:text-primary-300 font-semibold"
              >
                {sauce}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaucesMarquee;
