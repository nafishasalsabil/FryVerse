import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/helpers';
import { gsap } from '@/animations/gsap.config';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart();
  const cartRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create or get portal root
    let root = document.getElementById('cart-portal-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'cart-portal-root';
      document.body.appendChild(root);
    }
    setPortalRoot(root);

    return () => {
      // Cleanup portal root on unmount if empty
      if (root && root.children.length === 0 && root.parentNode) {
        root.parentNode.removeChild(root);
      }
    };
  }, []);

  useEffect(() => {
    if (!cartRef.current || !overlayRef.current) return;

    if (isOpen) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      );
      gsap.fromTo(
        cartRef.current,
        { x: 400 },
        { x: 0, duration: 0.3, ease: 'power2.out' }
      );
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(cartRef.current, { x: 400, duration: 0.3, ease: 'power2.in' });
    }
  }, [isOpen]);

  if (!isOpen || !portalRoot) return null;

  const cartContent = (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Cart Panel */}
      <div
        ref={cartRef}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gray-50 dark:bg-gray-800 z-[9999] flex flex-col overflow-hidden"
        style={{
          border: '2px solid rgba(249, 115, 22, 0.6)',
          boxShadow: '0 0 40px rgba(249, 115, 22, 0.4), 0 0 80px rgba(249, 115, 22, 0.2), 0 0 120px rgba(249, 115, 22, 0.1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-display font-bold">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
 {/* Cart Items */}
 <div className="flex-1 p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-24 h-24 text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Your cart is empty</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Add some fries to get started!</p>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 flex items-start gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {item.name}
                    </h3>
                    {item.customBox && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-1">
                        <div>Cut: {item.customBox.cut}</div>
                        <div>Seasoning: {item.customBox.seasoning}</div>
                        <div>Sauce: {item.customBox.sauce}</div>
                      </div>
                    )}
                    <div className="mt-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatPrice(item.price)} each
                      </div>
                      <div className="font-bold text-primary-600 dark:text-primary-400">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center focus:outline-none transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900 dark:text-gray-100">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center focus:outline-none transition-colors"
                        aria-label="Increase quantity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                      aria-label="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between text-xl font-bold">
              <span className="text-gray-900 dark:text-gray-100">Total:</span>
              <span className="text-primary-600 dark:text-primary-400 text-2xl">
                {formatPrice(getTotal())}
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
              className="btn-primary w-full text-lg py-3"
            >
              Checkout
            </button>
            <button
              onClick={clearCart}
              className="btn-outline w-full"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );

  return createPortal(cartContent, portalRoot);
};

export default Cart;
