import { Fry } from '@/data/fries';
import { formatPrice } from '@/utils/helpers';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTransition } from '@/contexts/TransitionContext';

interface CTARecapCardProps {
  fry: Fry;
  onBackToMenu: () => void;
}

const CTARecapCard = ({ fry, onBackToMenu }: CTARecapCardProps) => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { transitionRef } = useTransition();

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

  const handleExploreSimilar = () => {
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

  return (
    <section className="py-16 bg-white dark:bg-gray-900" data-reveal>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-primary-200 dark:border-primary-800 shadow-lg">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
              Ready to try {fry.name}?
            </h2>

            {/* Mini Recap Row */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2">
                <span className="badge-primary">{fry.cutType}</span>
                {fry.flavorTags.slice(0, 2).map((tag) => (
                  <span key={tag} className="badge-yellow text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-full ${
                      level <= fry.spice
                        ? 'bg-red-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {formatPrice(fry.price)}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              <button
                onClick={onBackToMenu}
                className="btn-outline text-lg py-3 px-8"
              >
                Back to Menu
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleExploreSimilar}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline"
              >
                Explore similar fries →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTARecapCard;
