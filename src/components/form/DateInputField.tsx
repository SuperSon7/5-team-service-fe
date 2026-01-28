"use client";

import type { FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";

type DateInputFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  helperText?: string;
  errorMessage?: string;
};

export default function DateInputField<T extends FieldValues>({
  name,
  label,
  helperText,
  errorMessage,
}: DateInputFieldProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2">
        <label className="text-base font-semibold text-gray-900">{label}</label>
        {helperText ? <p className="mt-1 text-xs text-gray-400">{helperText}</p> : null}
      </div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <input
            type="date"
            value={field.value ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm"
          />
        )}
      />
      {errorMessage ? <p className="text-xs text-red-500">{errorMessage}</p> : null}
    </div>
  );
}
