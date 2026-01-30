"use client";

import { useFormContext } from "react-hook-form";

type TextFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  maxLength?: number;
};

export default function TextField({
  name,
  label,
  placeholder,
  helperText,
  maxLength,
}: TextFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorMessage = (errors?.[name]?.message ?? "") as string;

  return (
    <div className="space-y-2">
      <div className="flex flex-row gap-2">
        <label className="text-base font-semibold text-gray-900">{label}</label>
        {helperText ? <p className="mt-1 text-xs text-gray-400">{helperText}</p> : null}
      </div>
      <input
        {...register(name)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition-colors duration-200 focus:border-[var(--color-primary-purple)]"
      />
      {errorMessage ? <p className="text-xs text-red-500">{errorMessage}</p> : null}
    </div>
  );
}
