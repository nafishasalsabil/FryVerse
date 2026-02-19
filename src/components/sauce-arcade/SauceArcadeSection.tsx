import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReveal } from '@/animations/useReveal';
import { getFeaturedSauce, getSaucesByMood } from '@/data/sauces';
import type { Sauce } from '@/data/sauces';
import FeaturedSauceCard from './FeaturedSauceCard';
import SauceMarquee from './SauceMarquee';
import SauceMoodFilter from './SauceMoodFilter';
import { useTransition } from '@/contexts/TransitionContext';

const SauceArcadeSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { transitionRef } = useTransition();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [highlightedSauceId, setHighlightedSauceId] = useState<string | null>(
    getFeaturedSauce().id
  );

  useReveal(sectionRef, { delay: 0.2 });

  const filteredSauces = getSaucesByMood(selectedMood);

  const handleTryCombo = () => {
    const featured = getFeaturedSauce();
    setHighlightedSauceId(featured.id);
    
    // Navigate to build box with preselected sauce and best cut type
    const preselectedSauce = featured.name;
    const preselectedCut = featured.bestWith.length > 0 ? featured.bestWith[0] : null;

    if (transitionRef.current) {
      transitionRef.current.startTransition(() => {
        const params = new URLSearchParams();
        params.set('sauce', preselectedSauce);
        if (preselectedCut) {
          params.set('cut', preselectedCut);
        }
        navigate(`/?${params.toString()}`);
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
      const params = new URLSearchParams();
      params.set('sauce', preselectedSauce);
      if (preselectedCut) {
        params.set('cut', preselectedCut);
      }
      navigate(`/?${params.toString()}`);
      setTimeout(() => {
        const buildBoxSection = document.getElementById('build-box');
        if (buildBoxSection) {
          buildBoxSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleSauceClick = (sauce: Sauce) => {
    setHighlightedSauceId(sauce.id);
  };

  return (
    <section
      id="sauces"
      ref={sectionRef}
      className="py-24 bg-white dark:bg-gray-900 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12" data-reveal>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            Sauce Arcade
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Level up your fry game with our premium sauce collection
          </p>
        </div>

        {/* Mood Filter */}
        <div data-reveal>
          <SauceMoodFilter selectedMood={selectedMood} onMoodChange={setSelectedMood} />
        </div>

        {/* Featured Sauce Card */}
        <div className="mb-12" data-reveal>
          <FeaturedSauceCard sauce={getFeaturedSauce()} onTryCombo={handleTryCombo} />
        </div>

        {/* Sauce Marquee */}
        <div data-reveal data-sauce-marquee>
          <SauceMarquee
            sauces={filteredSauces}
            highlightedSauceId={highlightedSauceId}
            onSauceClick={handleSauceClick}
          />
        </div>
      </div>
    </section>
  );
};

export default SauceArcadeSection;
