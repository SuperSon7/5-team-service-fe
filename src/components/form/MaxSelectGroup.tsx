"use client";

import { Controller, useFormContext } from "react-hook-form";

import type { PolicyOption } from "@/components/onboarding/model/stepInfo";
import type { OnboardingFormValues } from "@/components/onboarding/types";

type MaxSelectGroupProps = {
  name: keyof OnboardingFormValues;
  options: PolicyOption[];
  maxSelect: number;
};

export default function MaxSelectGroup({ name, options, maxSelect }: MaxSelectGroupProps) {
  const { control } = useFormContext<OnboardingFormValues>();
  const isSingleColumn = name === "3";

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div
          className={
            isSingleColumn ? "grid grid-cols-2 gap-5" : "flex flex-wrap items-center gap-3"
          }
        >
          {options.map((option) => {
            const selected = Array.isArray(field.value) ? field.value.includes(option.id) : false;
            const atLimit = Array.isArray(field.value) && field.value.length >= maxSelect;
            const disabled = !selected && atLimit;

            const baseClasses = isSingleColumn
              ? "w-full rounded-3xl border px-4 py-6 text-center text-body-1 !font-[600] transition"
              : "rounded-full border px-5 py-2 text-body-1 !font-[600] transition";
            const stateClasses = selected
              ? isSingleColumn
                ? "border-2 border-[var(--color-primary-purple)] shadow-[0_6px_16px_rgba(91,93,235,0.35)] bg-white text-gray-900"
                : "border-transparent bg-[var(--color-primary-purple)] text-white shadow-[0_6px_16px_rgba(91,93,235,0.35)]"
              : disabled
                ? "border-gray-200 bg-white text-gray-300"
                : "border-gray-300 bg-white text-gray-900";

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  if (!Array.isArray(field.value)) {
                    field.onChange([option.id]);
                    return;
                  }

                  if (selected) {
                    field.onChange(field.value.filter((value) => value !== option.id));
                    return;
                  }

                  if (!atLimit) {
                    field.onChange([...field.value, option.id]);
                  }
                }}
                className={`${baseClasses} ${stateClasses} ${disabled ? "cursor-not-allowed" : ""}`}
                aria-pressed={selected}
                disabled={disabled}
              >
                {option.name}
              </button>
            );
          })}
        </div>
      )}
    />
  );
}
