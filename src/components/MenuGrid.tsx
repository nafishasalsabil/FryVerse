import { useState, useMemo, useRef } from 'react';
import { fries, getCutTypes, getFlavorTags } from '@/data/fries';
import FryCard from './FryCard';
import { useReveal } from '@/animations/useReveal';
import { TransitionOverlayHandle } from './Layout/TransitionOverlay';
import SpiceSelector from './ui/SpiceSelector';

interface MenuGridProps {
  transitionRef?: React.RefObject<TransitionOverlayHandle>;
}

const MenuGrid = ({ transitionRef }: MenuGridProps) => {
  const [selectedCut, setSelectedCut] = useState<string>('All');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('All');
  const [maxSpice, setMaxSpice] = useState<number>(5);
  const sectionRef = useRef<HTMLElement>(null);

  const cutTypes = ['All', ...getCutTypes()];
  const flavorTags = ['All', ...getFlavorTags()];

  const filteredFries = useMemo(() => {
    return fries.filter((fry) => {
      const cutMatch = selectedCut === 'All' || fry.cutType === selectedCut;
      const flavorMatch =
        selectedFlavor === 'All' || fry.flavorTags.includes(selectedFlavor);
      const spiceMatch = fry.spice <= maxSpice;
      return cutMatch && flavorMatch && spiceMatch;
    });
  }, [selectedCut, selectedFlavor, maxSpice]);

  useReveal(sectionRef, { delay: 0.2, stagger: 0.1 });

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="py-24 bg-gray-50 dark:bg-gray-950"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-reveal>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            Our Menu
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our collection of 10 unique fry varieties, each with its own personality.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8" data-reveal>
          <div className="card p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cut Type
                </label>
                <select
                  value={selectedCut}
                  onChange={(e) => setSelectedCut(e.target.value)}
                  className="w-full px-4 py-2 h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
                >
                  {cutTypes.map((cut) => (
                    <option key={cut} value={cut}>
                      {cut}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Flavor
                </label>
                <select
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                  className="w-full px-4 py-2 h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
                >
                  {flavorTags.map((flavor) => (
                    <option key={flavor} value={flavor}>
                      {flavor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Spice Level
                </label>
                <div className="flex justify-end md:justify-start">
                  <SpiceSelector
                    value={maxSpice}
                    onChange={setMaxSpice}
                    min={1}
                    max={5}
                    size="md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFries.map((fry) => (
            <div key={fry.slug} data-reveal>
              <FryCard fry={fry} transitionRef={transitionRef} />
            </div>
          ))}
        </div>

        {filteredFries.length === 0 && (
          <div className="text-center py-12" data-reveal>
            <p className="text-gray-500 dark:text-gray-400">
              No fries match your filters. Try adjusting your selection.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuGrid;
