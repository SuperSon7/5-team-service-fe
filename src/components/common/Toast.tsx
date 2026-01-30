"use client";

type ToastProps = {
  message: string;
};

export default function Toast({ message }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="animate-toast-slide absolute right-6 top-20 rounded-xl bg-gradient-to-r from-[var(--color-primary-purple)] to-[#3f45d6] px-4 py-3 text-sm font-medium text-white shadow-[0_8px_18px_rgba(63,69,214,0.35)]">
      {message}
    </div>
  );
}
