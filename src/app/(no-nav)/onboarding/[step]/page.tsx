import { notFound } from "next/navigation";
import Question from "@/components/onboarding/Question";

export default async function OnboardingStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  const stepNumber = Number(step);

  if (!Number.isInteger(stepNumber) || stepNumber < 1 || stepNumber > 3) {
    notFound();
  }

  return <Question step={stepNumber} />;
}
