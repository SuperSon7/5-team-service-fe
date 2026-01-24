"use client";

import { ProfileData } from "@/components/onboarding/types";
import { apiFetch } from "@/lib/api/apiFetch";
import { useQuery } from "@tanstack/react-query";

export default function OnboardingEntry() {
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const profile = await apiFetch<ProfileData>("/users/me");
      return profile;
    },
  });

  const nickname = data?.nickname ?? "회원";

  return (
    <div className="flex flex-1 flex-col text-center overflow-hidden">
      <div className="pt-20 space-y-2">
        <h1 className="text-title-2 !font-[800] text-gray-900 leading-tight">
          반가워요 {nickname}님!
        </h1>
        <p className="text-body-1 text-gray-800">
          <span className="!font-[600]">독토리</span> 주민이 되신 것을 환영합니다!
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 text-body-1 text-gray-700">
        <div className="space-y-2 mt-15">
          <p>
            더 나은 독토리 경험을 위해
            <br />
            간단한 독서 성향 설문을 진행할게요.
          </p>
          <p>
            응답해주신 내용은 AI 분석에 활용되어
            <br />
            만두님과 딱 맞는 모임을 추천해드려요.
          </p>
        </div>
        <img
          src="/chracter.png"
          alt="독토리 캐릭터"
          className="h-60 w-60 max-h-[30vh] object-contain mt-18"
        />
      </div>
    </div>
  );
}
