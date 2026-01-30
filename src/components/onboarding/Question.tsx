"use client";

import { useQuery } from "@tanstack/react-query";

import MaxSelectGroup from "@/components/form/MaxSelectGroup";
import RadioGroup from "@/components/form/RadioGroup";
import { stepInfo } from "@/components/onboarding/model/stepInfo";
import type { PolicyOption } from "@/components/onboarding/model/stepInfo";
import { apiFetch } from "@/lib/api/apiFetch";

const stepFieldMap = {
  1: "1",
  2: "2",
  3: "3",
} as const;

export default function Question({ step }: { step: number }) {
  const info = stepInfo.find((item) => item.step === step);

  const { data } = useQuery({
    queryKey: ["policy", info?.endpoint ?? "unknown"],
    queryFn: async () => {
      if (!info) return [];

      const response = await apiFetch<PolicyOption[]>(info.endpoint, {});

      return response ?? [];
    },
    enabled: Boolean(info),
  });

  if (!info) {
    return null;
  }

  const title = `독서 ${info.type}`;
  const hasMaxSelect = typeof info.maxSelect === "number";
  const fieldName = stepFieldMap[step as 1 | 2 | 3];
  const options = data ?? [];
  const displayStep = step;

  return (
    <div className="mt-5 space-y-12">
      <div className="flex flex-col items-center text-center">
        <span className="rounded-full bg-[#5B5DEB] px-4 py-1 text-label text-white">
          STEP {displayStep}
        </span>
        <h1 className="mt-6 text-title-1 !text-[30px] text-gray-900">{title}</h1>
      </div>

      <div className="space-y-1">
        <h2 className="text-heading !text-[24px] !font-[600] text-gray-900 mb-3">
          {info.description}
        </h2>
        <h2 className="text-body-2 !font-[400] text-gray-400">{info.subdescription}</h2>
        {hasMaxSelect ? (
          <p className="text-body-2 !font-[400] text-gray-400">
            최대 {info.maxSelect}개까지 선택할 수 있어요.
          </p>
        ) : null}
      </div>

      {info.maxSelect ? (
        <MaxSelectGroup name={fieldName} options={options} maxSelect={info.maxSelect} />
      ) : (
        <RadioGroup name={fieldName} options={options} />
      )}
    </div>
  );
}
