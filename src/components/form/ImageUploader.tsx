"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Camera } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ImageUploaderProps = {
  urlName: string;
  fileName: string;
  label?: string;
  helperText?: string;
  fallbackText?: string;
};

export default function ImageUploader({ label = "프로필 이미지", helperText }: ImageUploaderProps) {
  const { setValue, watch } = useFormContext();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const profileImagePath = (watch("profileImagePath") as string | undefined) ?? "";
  const profileImageFile = (watch("profileImageFile") as File | null | undefined) ?? null;

  const objectUrl = useMemo(() => {
    if (!profileImageFile) return null;
    return URL.createObjectURL(profileImageFile);
  }, [profileImageFile]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const previewUrl = objectUrl ?? profileImagePath;

  const handleSelect = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    if (!file) {
      return;
    }

    setValue("profileImageFile", file, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Avatar className="relative size-30 overflow-visible">
        <div className="h-full w-full overflow-hidden rounded-full bg-gray-200 text-gray-500">
          <AvatarImage src={previewUrl ?? ""} alt={label} className="h-full w-full object-cover" />
          <AvatarFallback>프로필</AvatarFallback>
        </div>
        <button
          type="button"
          onClick={handleSelect}
          className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-primary-purple text-white shadow-md ring-2 ring-white"
          aria-label="프로필 이미지 업로드"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
        </button>
      </Avatar>
      <div className="flex flex-col items-center gap-1">
        {helperText ? <span className="text-xs text-gray-400">{helperText}</span> : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
