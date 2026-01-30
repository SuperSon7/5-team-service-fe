"use client";

import dynamic from "next/dynamic";

const OnboardingEntry = dynamic(() => import("@/components/onboarding/OnboardingEntry"), {
  ssr: false,
});

export default function OnboardingEntryPage() {
  return <OnboardingEntry />;
}
