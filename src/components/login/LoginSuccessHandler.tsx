"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api/apiFetch";
import { useAuthStore } from "@/stores/authStore";
import { Spinner } from "@/components/ui/spinner";

type TokenData = { accessToken: string };

type ProfileData = {
  nickname: string;
  profileImagePath: string | null;
  profileCompleted: boolean;
  onboardingCompleted: boolean;
  leaderIntro: string | null;
  memberIntro: string | null;
};

export default function LoginSuccessHandler() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        const tokenResponse = await apiFetch<TokenData>("/auth/tokens", {
          method: "POST",
        });

        const accessToken = tokenResponse?.accessToken;
        if (!accessToken) {
          throw new Error("Access token not found");
        }

        setAccessToken(accessToken);

        const profile = await apiFetch<ProfileData>("/users/me", {});
        if (profile) {
          queryClient.setQueryData(["profile"], profile);
        }

        const isProfileCompleted = profile?.profileCompleted;
        const isOnboardingCompleted = profile?.onboardingCompleted;

        if (isMounted) {
          if (!isProfileCompleted) {
            router.replace("/onboarding/required");
          } else {
            router.replace(isOnboardingCompleted ? "/" : "/onboarding");
          }
        }
      } catch (error) {
        console.log(error);
        if (isMounted) {
          setErrorMessage("로그인 처리에 실패했어요. 다시 시도해주세요.");
        }
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [queryClient, router, setAccessToken]);

  return (
    <div className="flex min-h-dvh items-center justify-center text-center">
      {errorMessage ? (
        <p className="text-base font-medium text-gray-700">{errorMessage}</p>
      ) : (
        <Spinner className="size-15 text-gray-700" />
      )}
    </div>
  );
}
