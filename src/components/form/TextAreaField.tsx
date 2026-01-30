"use client";

import { useFormContext } from "react-hook-form";

type TextAreaFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  maxLength?: number;
};

export default function TextAreaField({
  name,
  label,
  placeholder,
  helperText,
  maxLength,
}: TextAreaFieldProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(name) as string;
  const errorMessage = (errors?.[name]?.message ?? "") as string;

  return (
    <div className="space-y-2">
      <div className="flex flex-row gap-2">
        <label className="text-base font-semibold text-gray-900">{label}</label>
        {helperText ? <p className="mt-1 text-xs text-gray-400">{helperText}</p> : null}
      </div>
      <textarea
        {...register(name)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="min-h-[140px] w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition-colors duration-200 focus:border-[var(--color-primary-purple)]"
      />
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="text-red-500">{errorMessage}</span>
        {typeof maxLength === "number" ? (
          <span>
            {value?.length ?? 0}/{maxLength}
          </span>
        ) : null}
      </div>
    </div>
  );
}
