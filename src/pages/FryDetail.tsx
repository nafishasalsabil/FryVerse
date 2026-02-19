import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { getFryBySlug } from '@/data/fries';
import { sauces } from '@/data/sauces';
import { useReveal } from '@/animations/useReveal';
import { useTransition } from '@/contexts/TransitionContext';
import FryHero from '@/components/fry-detail/FryHero';
import FrySpecs from '@/components/fry-detail/FrySpecs';
import PairingCard from '@/components/fry-detail/PairingCard';
import CTARecapCard from '@/components/fry-detail/CTARecapCard';
import RelatedFries from '@/components/fry-detail/RelatedFries';
import { getPairingReason } from '@/utils/pairingReasons';

const FryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLElement>(null);
  const { transitionRef } = useTransition();

  const fry = slug ? getFryBySlug(slug) : null;

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    // Wait a bit for any transition animations to complete, then scroll to top
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 100);

    return () => clearTimeout(timer);
  }, [slug]);

  useReveal(pageRef, { delay: 0.3, stagger: 0.15 });

  const handleBackToMenu = () => {
    if (transitionRef.current) {
      transitionRef.current.startTransition(() => {
        navigate('/');
        setTimeout(() => {
          transitionRef.current?.endTransition();
          setTimeout(() => {
            const menuSection = document.getElementById('menu');
            if (menuSection) {
              menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 500);
        }, 50);
      });
    } else {
      navigate('/');
      setTimeout(() => {
        const menuSection = document.getElementById('menu');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleAddToBox = (sauceName: string) => {
    // Navigate to build box and preselect: current fry's cut + sauce
    const preselectedCut = fry.cutType;
    const preselectedSauce = sauceName;

    if (transitionRef.current) {
      transitionRef.current.startTransition(() => {
        navigate(`/?cut=${encodeURIComponent(preselectedCut)}&sauce=${encodeURIComponent(preselectedSauce)}`);
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
      navigate(`/?cut=${encodeURIComponent(preselectedCut)}&sauce=${encodeURIComponent(preselectedSauce)}`);
      setTimeout(() => {
        const buildBoxSection = document.getElementById('build-box');
        if (buildBoxSection) {
          buildBoxSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  if (!fry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Fry Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The fry you're looking for doesn't exist.
          </p>
          <button onClick={handleBackToMenu} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Get sauce objects for pairings
  const getSauceByName = (name: string) => {
    return sauces.find((s) => s.name.toLowerCase() === name.toLowerCase());
  };

  const pairingSauces = fry.bestSauces
    .map((sauceName) => getSauceByName(sauceName))
    .filter((sauce): sauce is NonNullable<typeof sauce> => sauce !== undefined)
    .slice(0, 3); // Limit to 3 pairings

  // Get a fun fact for the origin story
  const getFunFact = () => {
    const facts: Record<string, string> = {
      'Belgium': 'Did you know? Belgians eat more fries per capita than any other country!',
      'United States': 'Did you know? Americans consume over 4.5 billion pounds of fries annually!',
      'Peru': 'Did you know? Potatoes originated in Peru over 8,000 years ago!',
      'France': 'Did you know? French fries were actually invented in Belgium, not France!',
      'United Kingdom': 'Did you know? The UK calls them "chips" and serves them with fish!',
      'Italy': 'Did you know? Italian cuisine inspired many herb-based seasonings!',
    };
    return facts[fry.origin.country] || 'Did you know? Fries are one of the world\'s most beloved snacks!';
  };

  return (
    <main ref={pageRef} className="min-h-screen pt-16">
      {/* Hero Section */}
      <FryHero fry={fry} onBackToMenu={handleBackToMenu} />

      {/* Origin Story */}
      <section className="py-16 bg-white dark:bg-gray-900" data-reveal>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
              Origin Story
            </h2>
            <div className="mb-4">
              <span className="badge-primary text-base">
                {fry.origin.country}
                {fry.origin.region && `, ${fry.origin.region}`}
              </span>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line mb-6 max-w-2xl">
              {fry.origin.story}
            </p>
            
            {/* Fun Fact Callout */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-lg p-4 max-w-2xl">
              <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
                {getFunFact()}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fry Specs (Combined Ingredients, Bite Notes, Texture) */}
      <FrySpecs fry={fry} />

      {/* Best Sauce Pairings */}
      <section className="py-16 bg-white dark:bg-gray-900" data-reveal>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
              Best Sauce Pairings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pairingSauces.length > 0 ? (
                pairingSauces.map((sauce) => (
                  <PairingCard
                    key={sauce.id}
                    sauce={sauce}
                    reason={getPairingReason(fry, sauce)}
                    onAddToBox={handleAddToBox}
                  />
                ))
              ) : (
                // Fallback if sauces not found
                fry.bestSauces.slice(0, 3).map((sauceName) => {
                  const defaultSauce: typeof sauces[0] = {
                    id: sauceName.toLowerCase().replace(/\s+/g, '-'),
                    name: sauceName,
                    heat: 1,
                    tags: ['creamy'],
                    bestWith: [],
                    shortNote: 'Perfect pairing',
                  };
                  return (
                    <PairingCard
                      key={sauceName}
                      sauce={defaultSauce}
                      reason={`Perfect complement for ${fry.name}`}
                      onAddToBox={handleAddToBox}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Recap Card */}
      <CTARecapCard fry={fry} onBackToMenu={handleBackToMenu} />

      {/* More Like This */}
      <RelatedFries currentFry={fry} />
    </main>
  );
};

export default FryDetail;
