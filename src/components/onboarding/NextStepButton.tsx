"use client";

export type NextStepButtonProps = {
  currentStep: number;
  isSelected: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onSkip: () => void;
  showSkip?: boolean;
};

export default function NextStepButton({
  currentStep,
  isSelected,
  isLastStep,
  onNext,
  onSkip,
  showSkip = true,
}: NextStepButtonProps) {
  const entry = currentStep === 0;

  return (
    <div className="flex flex-col items-center gap-4" data-step={currentStep}>
      <button
        type="button"
        onClick={onNext}
        disabled={!isSelected}
        className={`w-full rounded-xl py-4 text-base font-semibold text-white transition ${
          !isSelected ? "bg-gray-300" : entry ? "bg-primary-purple" : "bg-gray-800"
        }`}
      >
        {entry ? "시작하기" : isLastStep ? "독토리 이용하러 가기" : "다음으로"}
      </button>
      {showSkip ? (
        <button type="button" onClick={onSkip} className="text-caption text-gray-400">
          건너뛰기
        </button>
      ) : null}
    </div>
  );
}
