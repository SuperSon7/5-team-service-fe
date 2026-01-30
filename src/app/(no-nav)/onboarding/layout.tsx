import OnboardingShell from "@/components/onboarding/OnboardingShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <OnboardingShell>{children}</OnboardingShell>;
}
