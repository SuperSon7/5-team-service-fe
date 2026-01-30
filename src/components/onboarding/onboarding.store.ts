import { create } from "zustand";

export type OnboardingAnswers = {
  1: number[];
  2: number | null;
  3: number[];
};

type Step = 1 | 2 | 3;
type StepValue<S extends Step> = OnboardingAnswers[S];

type OnboardingStore = {
  answers: OnboardingAnswers;
  setAnswer: <S extends Step>(step: S, value: StepValue<S>) => void;
  reset: () => void;
};

const initialAnswers: OnboardingAnswers = {
  1: [],
  2: null,
  3: [],
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  answers: initialAnswers,
  setAnswer: (step, value) =>
    set((state) => ({
      answers: { ...state.answers, [step]: value },
    })),
  reset: () => set({ answers: initialAnswers }),
}));
