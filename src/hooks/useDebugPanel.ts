import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from './useTheme';

export const useDebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('');
  const location = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Detect active section on home page
      if (location.pathname === '/') {
        const sections = ['hero', 'menu', 'build-box', 'sauces', 'locations'];
        const currentSection = sections.find((id) => {
          const element = document.getElementById(id);
          if (!element) return false;
          const rect = element.getBoundingClientRect();
          return rect.top <= 200 && rect.bottom >= 200;
        });
        setActiveSection(currentSection || '');
      } else {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return {
    isOpen,
    scrollY,
    activeSection,
    route: location.pathname,
    theme,
  };
};
