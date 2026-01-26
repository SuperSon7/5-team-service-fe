import Image from "next/image";

export type ConfirmModalProps = {
  isOpen: boolean;
  isClosing: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function WarningConfirmModal({
  isOpen,
  isClosing,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen && !isClosing) return null;

  const isVisible = isOpen && !isClosing;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-6 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-modal="true"
      role="dialog"
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        className={`relative w-full max-w-[360px] rounded-2xl bg-white px-6 py-8 !pt-3 text-center shadow-[0_24px_60px_rgba(15,23,42,0.18)] transition-all duration-200 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="mx-auto flex size-24 items-center justify-center">
          <Image src="/warning.png" alt="경고" width={72} height={72} priority />
        </div>
        <h2 className="mt-1 text-lg font-semibold text-gray-900">{title}</h2>
        {description ? <p className="mt-3 text-sm text-gray-500">{description}</p> : null}
        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-w-[96px] rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-600"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-w-[96px] rounded-xl bg-primary-purple py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(198,239,148,0.45)]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
