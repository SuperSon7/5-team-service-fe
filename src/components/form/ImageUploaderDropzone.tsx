"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";
import { UploadCloud } from "lucide-react";

type ImageUploaderDropzoneProps = {
  name: string;
  urlName?: string;
  accept?: string;
  label?: string;
  description?: string;
  onFileSelected?: (file: File, previewUrl: string) => void;
};

export default function ImageUploaderDropzone({
  name,
  urlName,
  accept = "image/*",
  label,
  description,
  onFileSelected,
}: ImageUploaderDropzoneProps) {
  const { setValue, formState, getFieldState } = useFormContext();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const file = (useWatch({ name }) as File | null | undefined) ?? null;
  const watchedUrl =
    (useWatch({ name: urlName ?? "__unused_image_uploader_url__" }) as string | undefined) ?? "";
  const urlValue = urlName ? watchedUrl : "";
  const fileError = getFieldState(name, formState).error?.message;
  const urlError = urlName ? getFieldState(urlName, formState).error?.message : undefined;
  const errorMessage = (fileError ?? urlError ?? "") as string;

  const objectUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const previewUrl = objectUrl || urlValue;

  const handleSelect = () => inputRef.current?.click();

  const handleFile = (nextFile: File | null) => {
    if (!nextFile) return;
    const nextPreviewUrl = URL.createObjectURL(nextFile);
    setValue(name, nextFile, { shouldDirty: true, shouldValidate: true });
    if (urlName) {
      setValue(urlName, nextPreviewUrl, { shouldDirty: true, shouldValidate: true });
    }
    onFileSelected?.(nextFile, nextPreviewUrl);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    event.target.value = "";
    handleFile(nextFile);
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const nextFile = event.dataTransfer.files?.[0] ?? null;
    handleFile(nextFile);
  };

  const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleSelect}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative flex h-50 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-white text-center transition-colors hover:border-gray-300"
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="업로드 이미지 미리보기"
            fill
            className="rounded-2xl object-cover"
            sizes="(max-width: 640px) 100vw, 640px"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 text-gray-500">
            <UploadCloud className="h-6 w-6" aria-hidden="true" />
            <div className="text-sm font-medium text-gray-700">{label}</div>
            <div className="text-xs text-gray-400">{description}</div>
          </div>
        )}
      </button>
      {errorMessage ? <span className="text-xs text-red-500">{errorMessage}</span> : null}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
