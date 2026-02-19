import ProgressIndicator from './ProgressIndicator';
import BoxStepRow from './BoxStepRow';

interface BoxBuilderSummaryProps {
  selectedCut: string | null;
  selectedSeasoning: string | null;
  selectedSauce: string | null;
  isComplete: boolean;
  onPickCut: () => void;
  onPickSeasoning: () => void;
  onPickSauce: () => void;
  onChangeCut: () => void;
  onChangeSeasoning: () => void;
  onChangeSauce: () => void;
}

const BoxBuilderSummary = ({
  selectedCut,
  selectedSeasoning,
  selectedSauce,
  isComplete,
  onPickCut,
  onPickSeasoning,
  onPickSauce,
  onChangeCut,
  onChangeSeasoning,
  onChangeSauce,
}: BoxBuilderSummaryProps) => {
  // Calculate current step (first missing selection)
  const getCurrentStep = () => {
    if (!selectedCut) return 1;
    if (!selectedSeasoning) return 2;
    if (!selectedSauce) return 3;
    return 3;
  };

  const currentStep = getCurrentStep();
  const stepLabels = ['Cut', 'Seasoning', 'Sauce'];

  // Calculate total (placeholder pricing)
  const basePrice = 5.99;
  const total = isComplete ? basePrice : null;

  // Icons
  const CutIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const SeasoningIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );

  const SauceIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );

  return (
    <div className="card p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-display font-bold mb-3">Your Perfect Box</h3>
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={3}
          labels={stepLabels}
        />
      </div>

      {/* Step Rows */}
      <div className="space-y-3">
        <BoxStepRow
          icon={<CutIcon />}
          label="Cut"
          value={selectedCut}
          placeholder="Pick your cut"
          onPick={onPickCut}
          onChange={onChangeCut}
        />
        <BoxStepRow
          icon={<SeasoningIcon />}
          label="Seasoning"
          value={selectedSeasoning}
          placeholder="Choose the dust"
          onPick={onPickSeasoning}
          onChange={onChangeSeasoning}
        />
        <BoxStepRow
          icon={<SauceIcon />}
          label="Sauce"
          value={selectedSauce}
          placeholder="Select a dip"
          onPick={onPickSauce}
          onChange={onChangeSauce}
        />
      </div>

      {/* Summary Strip */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">Total:</span>
          <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
            {total ? `$${total.toFixed(2)}` : '—'}
          </span>
        </div>
        {!isComplete && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Complete all 3 steps to add to cart.
          </p>
        )}
      </div>
    </div>
  );
};

export default BoxBuilderSummary;
