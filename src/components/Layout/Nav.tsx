import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useCart } from '@/contexts/CartContext';
import { TransitionOverlayHandle } from './TransitionOverlay';
import { scrollToSection } from '@/utils/helpers';
import Cart from '../Cart';

interface NavProps {
  transitionRef: React.RefObject<TransitionOverlayHandle>;
}

const Nav = ({ transitionRef }: NavProps) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { getItemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    if (href.startsWith('/')) {
      // Route navigation
      transitionRef.current?.startTransition(() => {
        navigate(href);
        setTimeout(() => {
          transitionRef.current?.endTransition();
        }, 50);
      });
    } else {
      // Anchor navigation
      transitionRef.current?.startTransition(() => {
        setTimeout(() => {
          scrollToSection(href.replace('#', ''), 80);
          setTimeout(() => {
            transitionRef.current?.endTransition();
          }, 300);
        }, 100);
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                handleNavClick(e, '#hero');
              } else {
                handleNavClick(e, '/');
              }
            }}
            className="text-2xl font-display font-bold text-primary-600 dark:text-primary-400"
          >
            FRYVERSE
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#menu"
              onClick={(e) => handleNavClick(e, '#menu')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none rounded px-2 py-1"
            >
              Menu
            </a>
            <a
              href="#build-box"
              onClick={(e) => handleNavClick(e, '#build-box')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none rounded px-2 py-1"
            >
              Build a Box
            </a>
            <a
              href="#sauces"
              onClick={(e) => handleNavClick(e, '#sauces')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none rounded px-2 py-1"
            >
              Sauces
            </a>
            <a
              href="#locations"
              onClick={(e) => handleNavClick(e, '#locations')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none rounded px-2 py-1"
            >
              Locations
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
              aria-label="Open cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn-primary hidden sm:inline-flex"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Nav;
