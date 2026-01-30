"use client";

export type ProfileFormActionButtonsProps = {
  isValid: boolean;
  onCancel: () => void;
  onSave: () => void;
};

export default function ProfileFormActionButtons({
  isValid,
  onCancel,
  onSave,
}: ProfileFormActionButtonsProps) {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 rounded-full border border-gray-300 py-3 text-sm font-semibold text-gray-700"
      >
        닫기
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={!isValid}
        className={`flex-1 rounded-full py-3 text-sm font-semibold text-white ${
          isValid ? "bg-primary-purple" : "bg-gray-300"
        }`}
      >
        저장하기
      </button>
    </div>
  );
}
