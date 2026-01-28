"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import TextAreaField from "@/components/form/TextAreaField";
import TextField from "@/components/form/TextField";
import { useQuery } from "@tanstack/react-query";
import { PolicyOption } from "../onboarding/model/stepInfo";
import { apiFetch } from "@/lib/api/apiFetch";
import { CreateMeetingFormValues } from "@/components/meeting/createMeetingSchema";
import RadioGroup from "../form/RadioGroup";
import NumberStepper from "../form/NumberStepper";
import { Spinner } from "../ui/spinner";
import WarningConfirmModal from "../common/WarningConfirmModal";
import { useAuthStore } from "@/stores/authStore";
import ImageUploaderDropzone from "@/components/form/ImageUploaderDropzone";

export default function MeetingCreateStep1() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data } = useQuery<PolicyOption[]>({
    queryKey: ["policy", "/policies/reading-genres"],
    queryFn: () => apiFetch<PolicyOption[]>("/policies/reading-genres", {}),
    staleTime: 1000 * 60 * 60, //1h
  });

  const { trigger, register } = useFormContext<CreateMeetingFormValues>();

  const basicFields: (keyof CreateMeetingFormValues)[] = useMemo(
    () => [
      "meetingImageFile",
      "meetingImagePath",
      "title",
      "description",
      "readingGenreId",
      "capacity",
      "leaderIntro",
    ],
    [],
  );

  const goNext = async () => {
    const isValid = await trigger(basicFields, { shouldFocus: true });
    if (isValid) {
      router.push("/meeting/create/detail");
    }
  };

  const genreOptions = useMemo(
    () => (data ?? []).map((genre) => ({ id: genre.id, name: genre.name })),
    [data],
  );

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

  if (!genreOptions) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="size-8 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col space-y-8">
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">모임 대표 사진</h2>
        <ImageUploaderDropzone
          name="meetingImageFile"
          urlName="meetingImagePath"
          label="이미지 업로드"
          description="최대 5MB 크기의 JPG, PNG 파일만 업로드 가능합니다."
        />
      </section>

      <TextField
        name="title"
        label="모임명"
        placeholder="모임명을 입력해주세요."
        helperText="최대 50자까지 입력 가능합니다."
      />

      <RadioGroup<CreateMeetingFormValues>
        name="readingGenreId"
        label="모임 주제"
        options={genreOptions}
        variant="dot"
      />

      <NumberStepper
        label="모집 인원"
        helperText="모집 인원은 최소 3명, 최대 8명으로 제한됩니다."
        name="capacity"
        min={3}
        max={8}
        step={1}
      />

      <TextAreaField
        name="description"
        label="모임 소개글"
        placeholder="우리 독서 모임에 대해 자유롭게 설명해주세요."
        maxLength={300}
      />

      <TextAreaField
        name="leaderIntro"
        label="모임장 소개글"
        placeholder="모임장 소개글을 작성해주세요."
        maxLength={300}
      />

      <section className="-mt-0 flex items-center gap-2">
        <input
          id="leaderIntroSavePolicy"
          type="checkbox"
          className="h-4 w-4 accent-[var(--color-primary-purple)]"
          {...register("leaderIntroSavePolicy")}
        />
        <label htmlFor="leaderIntroSavePolicy" className="text-sm font-medium text-gray-700">
          이 모임장 소개글을 계속 사용하기
        </label>
      </section>

      <button
        type="button"
        onClick={goNext}
        className="mt-auto w-full rounded-full py-4 text-sm font-semibold text-white bg-[var(--color-primary-purple)]"
      >
        다음
      </button>
    </div>
  );
}
