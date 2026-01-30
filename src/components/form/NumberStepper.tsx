import { FieldPath, FieldValues, useController, useFormContext } from "react-hook-form";

type NumberStepperProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  label: string;
  helperText: string;
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
  disabled?: boolean;
};

function clamp(value: number, min?: number, max?: number) {
  if (typeof min === "number") value = Math.max(min, value);
  if (typeof max === "number") value = Math.min(max, value);
  return value;
}

export default function NumberStepper<TFieldValues extends FieldValues>({
  name,
  label,
  helperText,
  min,
  max,
  step = 1,
  defaultValue = typeof min === "number" ? min + 1 : 0,
  disabled,
}: NumberStepperProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  const { field } = useController<TFieldValues>({
    name,
    control,
  });

  const current =
    typeof field.value === "number" ? field.value : Number(field.value ?? defaultValue);
  const value = Number.isFinite(current) ? current : defaultValue;

  const setNext = (next: number) => {
    const clamped = clamp(next, min, max);
    field.onChange(clamped);
  };

  const dec = () => setNext(value - step);
  const inc = () => setNext(value + step);

  const minusDisabled = disabled || (typeof min === "number" && value <= min);
  const plusDisabled = disabled || (typeof max === "number" && value >= max);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-3 items-center">
        <h2 className="text-base font-semibold text-gray-900">{label}</h2>
        <p className="text-xs text-gray-400">{helperText}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={minusDisabled}
          onClick={dec}
          className={`h-8 w-8 rounded-full border text-body-1 !text-[18px] transition-colors ${
            minusDisabled ? "border-red-500 text-red-500 animate-shake-x" : "border-gray-300"
          }`}
        >
          -
        </button>
        <span className="text-base text-body-1 !font-[500]">{value}</span>
        <button
          type="button"
          disabled={plusDisabled}
          onClick={inc}
          className={`h-8 w-8 rounded-full border text-body-1 !text-[18px] transition-colors ${
            plusDisabled ? "border-red-500 text-red-500 animate-shake-x" : "border-gray-300"
          }`}
        >
          +
        </button>
      </div>
    </div>
  );
}
