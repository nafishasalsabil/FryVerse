import { useEffect, useRef } from 'react';
import { gsap } from '@/animations/gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const ProgressIndicator = ({ currentStep, totalSteps, labels }: ProgressIndicatorProps) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    if (!progressRef.current || reducedMotion) return;

    const progressBar = progressRef.current.querySelector('.progress-bar') as HTMLElement;
    if (progressBar) {
      gsap.to(progressBar, {
        width: `${(currentStep / totalSteps) * 100}%`,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [currentStep, totalSteps, reducedMotion]);

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          {labels[currentStep - 1]}
        </span>
      </div>
      <div
        ref={progressRef}
        className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
      >
        <div
          className="progress-bar h-full bg-primary-500 rounded-full transition-all duration-300"
          style={{ width: reducedMotion ? `${progress}%` : undefined }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;
