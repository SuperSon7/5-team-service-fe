"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export default function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("text-body-2", className)}
      classNames={{
        months: "flex flex-col gap-4",
        month: "space-y-4",
        month_caption: "flex items-center justify-between gap-2",
        caption_label: "hidden",
        dropdowns: "flex items-center gap-2",
        dropdown_root: "relative",
        dropdown: "rounded-lg border border-gray-200 bg-white px-2 py-1 text-body-2 text-gray-900",
        months_dropdown: "w-[120px]",
        years_dropdown: "w-[96px]",
        chevron: "h-4 w-4 text-gray-500",
        nav: "flex items-center gap-2",
        button_previous:
          "h-8 w-8 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900",
        button_next:
          "h-8 w-8 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900",
        month_grid: "w-full border-collapse",
        weekdays: "text-center",
        weekday: "w-9 py-2 text-center text-micro font-medium text-gray-400",
        weeks: "text-center",
        week: "mt-2",
        day: "h-9 w-9 p-0 text-body-2",
        day_button:
          "mx-auto flex h-9 w-9 items-center justify-center rounded-full hover:bg-primary-green-3 hover:text-gray-900",
        day_selected: "bg-primary-green-1 text-gray-900 hover:bg-primary-green-1",
        day_today: "border border-primary-green-1",
        outside: "text-gray-200",
        ...classNames,
      }}
      {...props}
    />
  );
}
