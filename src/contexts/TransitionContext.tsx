import { createContext, useContext, useRef, ReactNode } from 'react';
import { TransitionOverlayHandle } from '@/components/Layout/TransitionOverlay';

interface TransitionContextType {
  transitionRef: React.RefObject<TransitionOverlayHandle>;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider = ({ children }: { children: ReactNode }) => {
  const transitionRef = useRef<TransitionOverlayHandle>(null);

  return (
    <TransitionContext.Provider value={{ transitionRef }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};
