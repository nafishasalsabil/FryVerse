import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { TransitionProvider, useTransition } from './contexts/TransitionContext';
import { CartProvider } from './contexts/CartContext';
import { DiscountProvider } from './contexts/DiscountContext';
import TransitionOverlay from './components/Layout/TransitionOverlay';

function TransitionWrapper() {
  const { transitionRef } = useTransition();
  return <TransitionOverlay ref={transitionRef} />;
}

function AppContent() {
  return (
    <>
      <TransitionWrapper />
      <RouterProvider router={router} />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <DiscountProvider>
        <TransitionProvider>
          <AppContent />
        </TransitionProvider>
      </DiscountProvider>
    </CartProvider>
  );
}

export default App;
