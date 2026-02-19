import { Link, useNavigate } from 'react-router-dom';
import { Fry } from '@/data/fries';
import { formatPrice } from '@/utils/helpers';
import { useCart } from '@/contexts/CartContext';
import { TransitionOverlayHandle } from './Layout/TransitionOverlay';

interface FryCardProps {
  fry: Fry;
  transitionRef?: React.RefObject<TransitionOverlayHandle>;
}

const FryCard = ({ fry, transitionRef }: FryCardProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const href = `/fries/${fry.slug}`;
    
    if (transitionRef?.current) {
      transitionRef.current.startTransition(() => {
        navigate(href);
        setTimeout(() => {
          transitionRef.current?.endTransition();
        }, 50);
      });
    } else {
      navigate(href);
    }
  };

  const renderSpiceMeter = () => {
    return (
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
    );
  };

  return (
    <div className="card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-display font-bold mb-2">{fry.name}</h3>
          <span className="badge-primary">{fry.cutType}</span>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {formatPrice(fry.price)}
          </div>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4">{fry.shortDescription}</p>

      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Spice Level</span>
          {renderSpiceMeter()}
        </div>
        <div className="flex flex-wrap gap-2">
          {fry.flavorTags.slice(0, 2).map((tag) => (
            <span key={tag} className="badge-yellow text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addItem({
              id: `fry-${fry.slug}`,
              name: fry.name,
              price: fry.price,
              type: 'fry',
            });
          }}
          className="btn-primary flex-1"
        >
          Add to Cart
        </button>
        <Link
          to={`/fries/${fry.slug}`}
          onClick={handleCardClick}
          className="btn-outline"
        >
          Learn Origin
        </Link>
      </div>
    </div>
  );
};

export default FryCard;
