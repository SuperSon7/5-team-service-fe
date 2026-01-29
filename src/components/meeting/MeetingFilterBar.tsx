"use client";

import { useState } from "react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

type FilterOption = {
  code: string;
  name: string;
};

type SheetType = "schedule" | "topic" | null;

type MeetingFilterBarProps = {
  scheduleOptions: FilterOption[];
  dayOptions: FilterOption[];
  timeOptions: FilterOption[];
  topicOptions: FilterOption[];
  onApply?: (filters: {
    roundCountCode: string | null;
    dayOfWeekCodes: string[];
    startTimeCodes: string[];
    topicCodes: string[];
  }) => void;
};

export default function MeetingFilterBar({
  scheduleOptions,
  dayOptions,
  timeOptions,
  topicOptions,
  onApply,
}: MeetingFilterBarProps) {
  const [openSheet, setOpenSheet] = useState<SheetType>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const closeSheet = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsClosing(false);
      setOpenSheet(null);
    }, 200);
  };

  const toggleValue = (value: string, list: string[], setList: (next: string[]) => void) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
      return;
    }
    setList([...list, value]);
  };

  const resetScheduleFilters = () => {
    setSelectedSchedule(null);
    setSelectedDays([]);
    setSelectedTimes([]);
    onApply?.({
      roundCountCode: null,
      dayOfWeekCodes: [],
      startTimeCodes: [],
      topicCodes: selectedTopics,
    });
  };

  const resetTopicFilters = () => {
    setSelectedTopics([]);
    onApply?.({
      roundCountCode: selectedSchedule,
      dayOfWeekCodes: selectedDays,
      startTimeCodes: selectedTimes,
      topicCodes: [],
    });
  };

  const applyFilters = () => {
    onApply?.({
      roundCountCode: selectedSchedule,
      dayOfWeekCodes: selectedDays,
      startTimeCodes: selectedTimes,
      topicCodes: selectedTopics,
    });
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
        <button
          type="button"
          onClick={() => setOpenSheet("schedule")}
          className={`rounded-full border px-3 py-1 text-body-2 ${
            selectedSchedule || selectedDays.length > 0 || selectedTimes.length > 0
              ? "border-[var(--color-primary-purple)] text-[var(--color-primary-purple)]"
              : "border-gray-300 text-gray-700"
          }`}
        >
          일정
        </button>
        <button
          type="button"
          onClick={() => setOpenSheet("topic")}
          className={`rounded-full border px-3 py-1 text-body-2 ${
            selectedTopics.length > 0
              ? "border-[var(--color-primary-purple)] text-[var(--color-primary-purple)]"
              : "border-gray-300 text-gray-700"
          }`}
        >
          주제
        </button>
      </div>

      {openSheet || isClosing ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button
            type="button"
            className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
              openSheet && !isClosing ? "opacity-100" : "opacity-0"
            }`}
            aria-label="닫기"
            onClick={closeSheet}
          />
          <div
            className={`relative w-full max-w-[500px] rounded-t-3xl bg-white px-6 pb-8 pt-6 shadow-[0_-12px_30px_rgba(0,0,0,0.12)] transition-transform duration-200 ${
              openSheet && !isClosing ? "translate-y-0 animate-sheet-up" : "translate-y-full"
            }`}
          >
            {openSheet === "schedule" ? (
              <div className="space-y-6">
                <h3 className="text-subheading !font-[700] text-gray-900">일정</h3>
                <section className="space-y-3">
                  <p className="text-body-2 !font-[600] text-gray-900">횟수</p>
                  <div className="flex flex-wrap gap-2">
                    {scheduleOptions.map((option) => {
                      const selected = selectedSchedule === option.code;
                      return (
                        <button
                          key={option.code}
                          type="button"
                          onClick={() => setSelectedSchedule(selected ? null : option.code)}
                          className={`rounded-full border px-4 py-2 text-body-2 ${
                            selected
                              ? "border-[var(--color-primary-purple)] bg-[var(--color-primary-purple)] text-white"
                              : "border-gray-300 bg-white text-gray-700"
                          }`}
                        >
                          {option.name}
                        </button>
                      );
                    })}
                  </div>
                </section>
                <section className="space-y-3">
                  <p className="text-body-2 !font-[600] text-gray-900">요일 (복수 선택 가능)</p>
                  <div className="flex flex-wrap gap-2">
                    {dayOptions.map((option) => {
                      const selected = selectedDays.includes(option.code);
                      return (
                        <button
                          key={option.code}
                          type="button"
                          onClick={() => toggleValue(option.code, selectedDays, setSelectedDays)}
                          className={`rounded-full border px-4 py-2 text-body-2 ${
                            selected
                              ? "border-[var(--color-primary-purple)] bg-[var(--color-primary-purple)] text-white"
                              : "border-gray-300 bg-white text-gray-700"
                          }`}
                        >
                          {option.name}
                        </button>
                      );
                    })}
                  </div>
                </section>
                <section className="space-y-3">
                  <p className="text-body-2 !font-[600] text-gray-900">
                    시작 시간 (복수 선택 가능)
                  </p>
                  <div className="space-y-2">
                    {timeOptions.map((option) => {
                      const checked = selectedTimes.includes(option.code);
                      return (
                        <label
                          key={option.code}
                          className="flex items-center gap-3 text-body-2 text-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              toggleValue(option.code, selectedTimes, setSelectedTimes)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary-purple)]"
                          />
                          {option.name}
                        </label>
                      );
                    })}
                  </div>
                </section>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-subheading !font-[700] text-gray-900">주제</h3>
                <div className="space-y-2">
                  {topicOptions.map((option) => {
                    const checked = selectedTopics.includes(option.code);
                    return (
                      <label
                        key={option.code}
                        className="flex items-center gap-3 text-body-2 text-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleValue(option.code, selectedTopics, setSelectedTopics)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary-purple)]"
                        />
                        {option.name}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  if (openSheet === "schedule") {
                    resetScheduleFilters();
                  } else {
                    resetTopicFilters();
                  }
                  closeSheet();
                }}
                className="flex-1 rounded-xl bg-gray-100 py-3 text-body-2 !font-[600] text-gray-700"
              >
                초기화
              </button>
              <button
                type="button"
                onClick={() => {
                  applyFilters();
                  closeSheet();
                }}
                className="flex-1 rounded-xl bg-[var(--color-primary-purple)] py-3 text-body-2 !font-[600] text-white"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
