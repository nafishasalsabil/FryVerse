import { useNavigate } from 'react-router-dom';
import { Fry, fries } from '@/data/fries';
import { formatPrice } from '@/utils/helpers';
import { useTransition } from '@/contexts/TransitionContext';

interface RelatedFriesProps {
  currentFry: Fry;
}

const RelatedFries = ({ currentFry }: RelatedFriesProps) => {
  const navigate = useNavigate();
  const { transitionRef } = useTransition();

  // Find related fries based on flavor tags and spice level
  const getRelatedFries = (): Fry[] => {
    const related = fries
      .filter((f) => f.slug !== currentFry.slug)
      .map((f) => {
        let score = 0;
        // Score based on shared flavor tags
        f.flavorTags.forEach((tag) => {
          if (currentFry.flavorTags.includes(tag)) score += 2;
        });
        // Score based on similar spice level
        if (Math.abs(f.spice - currentFry.spice) <= 1) score += 1;
        // Score based on same cut type
        if (f.cutType === currentFry.cutType) score += 1;
        return { fry: f, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.fry);

    // If we don't have enough, add some random ones
    if (related.length < 3) {
      const remaining = fries
        .filter((f) => f.slug !== currentFry.slug && !related.find((r) => r.slug === f.slug))
        .slice(0, 3 - related.length);
      related.push(...remaining);
    }

    return related.slice(0, 3);
  };

  const handleFryClick = (slug: string) => {
    if (transitionRef.current) {
      transitionRef.current.startTransition(() => {
        navigate(`/fries/${slug}`);
        setTimeout(() => {
          transitionRef.current?.endTransition();
        }, 50);
      });
    } else {
      navigate(`/fries/${slug}`);
    }
  };

  const relatedFries = getRelatedFries();

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-950" data-reveal>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-8 text-center">
            More Like This
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedFries.map((fry) => (
              <div
                key={fry.slug}
                onClick={() => handleFryClick(fry.slug)}
                className="card-hover p-6 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-gray-100">
                      {fry.name}
                    </h3>
                    <span className="badge-primary text-sm">{fry.cutType}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {formatPrice(fry.price)}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {fry.shortDescription}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          level <= fry.spice
                            ? 'bg-red-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {fry.flavorTags.slice(0, 2).map((tag) => (
                      <span key={tag} className="badge-yellow text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatedFries;
