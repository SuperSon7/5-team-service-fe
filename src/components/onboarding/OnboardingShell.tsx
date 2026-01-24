"use client";

import { useEffect, useMemo } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import NextStepButton from "@/components/onboarding/NextStepButton";
import ProgressBar from "@/components/onboarding/ProgressBar";
import { useOnboardingStore } from "@/components/onboarding/onboarding.store";
import type { OnboardingFormValues, ProfileData } from "@/components/onboarding/types";
import { apiFetch } from "@/lib/api/apiFetch";

const TOTAL_STEP = 3;

export default function OnboardingShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams<{ step?: string }>();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { answers, setAnswer } = useOnboardingStore();

  const form = useForm<OnboardingFormValues>({
    mode: "onChange",
    defaultValues: {
      "1": answers[1],
      "2": answers[2],
      "3": answers[3],
    },
  });

  const step1 = useWatch({ control: form.control, name: "1" });
  const step2 = useWatch({ control: form.control, name: "2" });
  const step3 = useWatch({ control: form.control, name: "3" });

  useEffect(() => {
    setAnswer(1, step1 ?? []);
  }, [setAnswer, step1]);

  useEffect(() => {
    setAnswer(2, step2 ?? null);
  }, [setAnswer, step2]);

  useEffect(() => {
    setAnswer(3, step3 ?? []);
  }, [setAnswer, step3]);

  const currentStep = useMemo(() => {
    const rawStep = params?.step;
    if (!rawStep) {
      return 0;
    }
    const parsed = Number(rawStep);
    if (Number.isNaN(parsed)) {
      return 0;
    }
    return parsed;
  }, [params]);

  const showStepUi =
    pathname?.startsWith("/onboarding/") &&
    currentStep !== null &&
    currentStep >= 1 &&
    currentStep <= TOTAL_STEP;

  const isSelected = useMemo(() => {
    if (currentStep === 0) {
      return true;
    }
    if (currentStep === 1) {
      return Array.isArray(step1) && step1.length > 0;
    }
    if (currentStep === 2) {
      return typeof step2 === "number";
    }
    return Array.isArray(step3) && step3.length > 0;
  }, [currentStep, step1, step2, step3]);

  const isLastStep = currentStep === TOTAL_STEP;

  const onNext = () => {
    if (isLastStep) {
      const payload: Record<string, number | number[] | null> = {
        userReadingGenreIds: answers[1],
        readingVolumeId: answers[2],
        readingPurposeIds: answers[3],
      };

      const run = async () => {
        try {
          const response = await apiFetch<ProfileData>("/users/me/onboarding", {
            method: "PUT",
            body: JSON.stringify(payload),
          });

          if (response) {
            queryClient.setQueryData(["profile"], response);
          }
        } catch (error) {
          console.log(error);
        } finally {
          router.push("/");
        }
      };

      run();
      return;
    }
    router.push(`/onboarding/${currentStep + 1}`);
  };

  const onSkip = () => {
    if (currentStep === 0) {
      router.push("/");
    }

    const payload: Record<string, number | number[] | null> = {};

    if (currentStep >= 2) {
      payload.userReadingGenreIds = answers[1];
    }
    if (currentStep >= 3 && answers[2] !== null) {
      payload.readingVolumeId = answers[2];
    }

    const run = async () => {
      try {
        if (Object.keys(payload).length > 0) {
          const response = await apiFetch<ProfileData>("/users/me/onboarding", {
            method: "PUT",
            body: JSON.stringify(payload),
          });

          if (response) {
            queryClient.setQueryData(["profile"], response);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        router.push("/");
      }
    };

    run();
  };

  return (
    <FormProvider {...form}>
      <div className="flex min-h-dvh w-full flex-col px-8 py-8">
        {showStepUi ? <ProgressBar currentStep={currentStep} totalStep={TOTAL_STEP} /> : null}

        <div className={showStepUi ? "mt-8 flex-1" : "flex flex-1 h-full w-full"}>{children}</div>

        <div className="pb-4 mt-auto">
          <NextStepButton
            currentStep={currentStep}
            isSelected={isSelected}
            isLastStep={isLastStep}
            onNext={onNext}
            onSkip={onSkip}
            showSkip={true}
          />
        </div>
      </div>
    </FormProvider>
  );
}
