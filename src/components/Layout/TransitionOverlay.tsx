import { forwardRef, useImperativeHandle } from 'react';
import { useRouteTransition } from '@/hooks/useRouteTransition';

export interface TransitionOverlayHandle {
  startTransition: (onComplete?: () => void) => void;
  endTransition: (onComplete?: () => void) => void;
}

const TransitionOverlay = forwardRef<TransitionOverlayHandle>((_props, ref) => {
  const { overlayRef, startTransition, endTransition } = useRouteTransition();

  useImperativeHandle(ref, () => ({
    startTransition,
    endTransition,
  }));

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 bg-primary-500 dark:bg-primary-600"
        style={{
          clipPath: 'circle(0% at 50% 50%)',
        }}
      />
    </div>
  );
});

TransitionOverlay.displayName = 'TransitionOverlay';

export default TransitionOverlay;
