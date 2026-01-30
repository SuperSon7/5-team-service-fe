"use client";

type ProgressBarProps = {
  currentStep: number;
  totalStep: number;
};

export default function ProgressBar({ currentStep, totalStep }: ProgressBarProps) {
  const steps = Array.from({ length: totalStep }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-3">
      {steps.map((step) => {
        const isFilled = step <= currentStep;

        return (
          <div key={step} className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full bg-[#5B5DEB] transition-[width] duration-500 ease-out ${
                isFilled ? "w-full" : "w-0"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
