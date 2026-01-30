export type OnboardingFormValues = {
  "1": number[];
  "2": number | null;
  "3": number[];
  birthYear: string;
  gender: "FEMALE" | "MALE";
  notificationAgreement: true | false;
};

export type ProfileData = {
  nickname: string;
  profileImagePath: string;
  profileCompleted: boolean;
  onboardingCompleted: boolean;
  leaderIntro: string | null;
  memberIntro: string | null;
};
