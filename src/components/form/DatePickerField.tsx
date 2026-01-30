"use client";

import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { format, parseISO } from "date-fns";
import { useFormContext } from "react-hook-form";

import Calendar from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
type DatePickerFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
};

export default function DatePickerField({
  name,
  label,
  placeholder = "생년월일을 선택해 주세요",
}: DatePickerFieldProps) {
  const { watch, setValue } = useFormContext();
  const value = watch(name);
  const selected = value ? parseISO(value) : undefined;

  return (
    <div>
      <label className="text-body-emphasis text-gray-900">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="mt-4 flex w-full items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 text-left text-body-1 text-gray-900 transition hover:border-gray-300"
          >
            <span className={selected ? "text-gray-900" : "text-gray-400"}>
              {selected ? format(selected, "yyyy.MM.dd") : placeholder}
            </span>
            <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              setValue(name, date ? format(date, "yyyy-MM-dd") : "", {
                shouldValidate: true,
              });
            }}
            captionLayout="dropdown"
            hideNavigation
            className="p-4"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
