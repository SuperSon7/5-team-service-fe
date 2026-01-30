"use client";

import { useFormContext } from "react-hook-form";
import type { OnboardingFormValues } from "@/components/onboarding/types";

const genderOptions = [
  { label: "남성", value: "MALE" },
  { label: "여성", value: "FEMALE" },
] as const;

const consentOptions = [
  { label: "동의", value: true },
  { label: "비동의", value: false },
] as const;

export default function RequiredInfo({ onSubmit }: { onSubmit: () => void }) {
  const { register, setValue, watch } = useFormContext<OnboardingFormValues>();
  const gender = watch("gender");
  const notificationAgreement = watch("notificationAgreement");
  const birthYear = watch("birthYear");
  const isComplete = Boolean(birthYear) && Boolean(gender) && notificationAgreement !== undefined;

  return (
    <div className="mt-10 flex w-full flex-col space-y-7">
      <div className="space-y-3">
        <h2 className="text-heading !text-[24px] !font-[700] text-gray-900">거의 다 왔어요!</h2>
        <p className="text-body-2 !font-[400] text-gray-400">
          회원가입을 위한 몇 가지 정보를 입력해주세요.
        </p>
      </div>

      <div className="mt-8 w-full space-y-2">
        <label className="text-body-emphasis text-gray-900">출생년도</label>
        <p className="mt-2 text-xs text-gray-500">모임 추천을 위한 데이터로 사용돼요.</p>
        <input
          {...register("birthYear")}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          placeholder="예: 1998"
          className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-4 text-sm text-gray-900 outline-none focus:border-gray-900"
        />
      </div>

      <div className="mt-3">
        <div>
          <span className="text-body-emphasis text-gray-900">성별</span>
          <p className="mt-2 text-xs text-gray-500">모임 추천을 위한 데이터로 사용돼요.</p>
        </div>
        <div className="mt-4 flex items-center gap-10">
          {genderOptions.map((option) => {
            const selected = gender === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue("gender", option.value, { shouldValidate: true })}
                className="flex items-center gap-3 text-body-1 !font-[600] text-gray-900"
              >
                <span
                  className={`flex size-6 items-center justify-center rounded-full border-2 ${
                    selected ? "border-[#5B5DEB]" : "border-gray-300"
                  }`}
                >
                  {selected ? <span className="block size-3 rounded-full bg-[#5B5DEB]" /> : null}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <div>
          <span className="text-body-emphasis text-gray-900">알림 수신 동의</span>
          <p className="mt-2 text-xs text-gray-500">모임 소식과 추천 알림을 받을 수 있어요.</p>
        </div>
        <div className="mt-4 flex items-center gap-10">
          {consentOptions.map((option) => {
            const selected = notificationAgreement === option.value;

            return (
              <button
                key={option.value ? "AGREE" : "DISAGREE"}
                type="button"
                onClick={() =>
                  setValue("notificationAgreement", option.value, { shouldValidate: true })
                }
                className="flex items-center gap-3 text-body-1 !font-[600] text-gray-900"
              >
                <span
                  className={`flex size-6 items-center justify-center rounded-full border-2 ${
                    selected ? "border-[#5B5DEB]" : "border-gray-300"
                  }`}
                >
                  {selected ? <span className="block size-3 rounded-full bg-[#5B5DEB]" /> : null}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        disabled={!isComplete}
        onClick={onSubmit}
        className={`mt-auto mb-5 flex w-full items-center justify-center rounded-full py-4 text-body-1 !font-[700] text-white transition ${
          isComplete ? "bg-[#5B5DEB]" : "bg-gray-300"
        }`}
      >
        가입하기
      </button>
    </div>
  );
}
