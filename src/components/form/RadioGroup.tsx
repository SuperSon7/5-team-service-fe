"use client";

import type { FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";

type RadioOption = {
  id: string | number;
  name: string;
};

type RadioGroupProps = {
  name: string;
  label?: string;
  helperText?: string;
  options: RadioOption[];
  variant?: "default" | "dot" | "pill-sm";
  onChange?: (value: RadioOption["id"]) => void;
};

export default function RadioGroup<T extends FieldValues>({
  name,
  label,
  helperText,
  options,
  variant = "default",
  onChange,
}: RadioGroupProps) {
  const { control } = useFormContext<T>();
  const isDot = variant === "dot";
  const isPillSm = variant === "pill-sm";

  return (
    <Controller
      control={control}
      name={name as Path<T>}
      render={({ field }) => (
        <div className="flex flex-col gap-4">
          {label || helperText ? (
            <div className="flex flex-row gap-2">
              {label ? (
                <label className="text-base font-semibold text-gray-900">{label}</label>
              ) : null}
              {helperText ? <p className="mt-1 text-xs text-gray-400">{helperText}</p> : null}
            </div>
          ) : null}
          <div className={isDot ? "flex flex-col gap-4" : "flex flex-wrap items-center gap-2"}>
            {options.map((option) => {
              const checked = field.value === option.id;

              return (
                <label
                  key={option.id}
                  className={
                    isDot
                      ? "flex cursor-pointer items-center gap-3 text-body-2 !font-[500] text-gray-900"
                      : isPillSm
                        ? `cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition ${
                            checked
                              ? "border-transparent bg-[var(--color-primary-purple)] text-white"
                              : "border-gray-300 text-gray-700"
                          }`
                        : `cursor-pointer rounded-full border px-5 py-3 text-body-1 !font-[600] transition ${
                            checked
                              ? "border-transparent bg-[#5B5DEB] text-white shadow-[0_6px_16px_rgba(91,93,235,0.35)]"
                              : "border-gray-300 bg-white text-gray-900"
                          }`
                  }
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name={field.name}
                    value={option.id}
                    checked={checked}
                    onChange={() => {
                      field.onChange(option.id);
                      onChange?.(option.id);
                    }}
                  />
                  {isDot ? (
                    <>
                      <span
                        className={`flex size-6 items-center justify-center rounded-full border-2 ${
                          checked ? "border-[#5B5DEB]" : "border-gray-300"
                        }`}
                      >
                        {checked ? (
                          <span className="block size-3 rounded-full bg-[#5B5DEB]" />
                        ) : null}
                      </span>
                      <span>{option.name}</span>
                    </>
                  ) : (
                    <span>{option.name}</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
