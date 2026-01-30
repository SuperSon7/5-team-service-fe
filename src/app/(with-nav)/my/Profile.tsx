"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api/apiFetch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { authStore, useAuthStore } from "@/stores/authStore";
import { ProfileData } from "@/components/onboarding/types";
import MyPageOption from "@/components/my/MyPageOption";
import WarningConfirmModal from "@/components/common/WarningConfirmModal";

export default function Profile() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [modalType, setModalType] = useState<"logout" | "withdraw" | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const profile = await apiFetch<ProfileData>("/users/me", {});
      return profile;
    },
    enabled: Boolean(accessToken),
  });

  const nickname = data?.nickname ?? "사용자";
  const profileImage = data?.profileImagePath ?? "/public/login.png";

  const handleOpenModal = (type: "logout" | "withdraw") => {
    setModalType(type);
    setIsClosing(false);
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsClosing(false);
      setModalType(null);
    }, 200);
  };

  const handleLogout = async () => {
    try {
      await apiFetch<void>("/auth/tokens", {
        method: "DELETE",
        skipRefresh: true,
      });
    } catch (error) {
      console.log(error);
    } finally {
      authStore.clear();
      router.push("/");
    }
  };

  if (!accessToken) {
    return (
      <WarningConfirmModal
        isOpen={!accessToken}
        isClosing={false}
        title="로그인이 필요해요!"
        description="로그인 후 더 많은 독토리 서비스를 이용해보세요."
        confirmLabel="로그인하기"
        cancelLabel="홈으로"
        onConfirm={() => router.push("/oauth")}
        onClose={() => router.push("/")}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <Spinner className="size-15 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="px-6 pb-10 pt-6">
      <div className="px-1 mb-10 flex justify-between items-center gap-4">
        <div>
          <p className="text-subheading text-gray-900">
            {nickname}
            <span className="text-body-1 text-gray-900"> 님, 독토리에서</span>
          </p>
          <p className="text-body-1 text-gray-900">책과 함께 좋은 하루 보내세요!</p>
        </div>
        <Avatar className="relative size-20 overflow-visible">
          <div className="h-full w-full overflow-hidden rounded-full bg-gray-100">
            <AvatarImage
              src={profileImage}
              alt="사용자 프로필"
              className="h-full w-full object-cover"
            />
            <AvatarFallback>{nickname.slice(0, 1)}</AvatarFallback>
          </div>
          <Link
            href="/my/profile/edit"
            className="absolute -bottom-1 right-0.5 flex size-6 items-center justify-center rounded-full bg-gray-900 text-white shadow-md ring-2 ring-white"
            aria-label="프로필 수정"
          >
            <Pencil className="h-3 w-3" aria-hidden="true" />
          </Link>
        </Avatar>
      </div>

      <div className="mt-6 border-t border-gray-200">
        <MyPageOption label="로그아웃" onClick={() => handleOpenModal("logout")} />
        <MyPageOption label="회원탈퇴" onClick={() => handleOpenModal("withdraw")} />
      </div>

      <WarningConfirmModal
        isOpen={modalType !== null}
        isClosing={isClosing}
        title={modalType === "withdraw" ? "정말 탈퇴 하시겠습니까?" : "로그아웃 하시겠습니까?"}
        description={
          modalType === "withdraw"
            ? "탈퇴 후에는 모임 참여 및 서비스 접근이 제한됩니다."
            : undefined
        }
        confirmLabel="확인"
        cancelLabel="취소"
        onClose={handleCloseModal}
        onConfirm={modalType === "logout" ? handleLogout : handleCloseModal}
      />
    </div>
  );
}
