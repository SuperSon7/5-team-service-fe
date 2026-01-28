"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext, useWatch } from "react-hook-form";

import { CreateMeetingFormValues } from "@/components/meeting/createMeetingSchema";
import NumberStepper from "../form/NumberStepper";
import calculateEndTime from "@/lib/calculateEndTime";
import calculateRoundDates from "@/lib/calculateRoundDates";
import RadioGroup from "@/components/form/RadioGroup";
import DateInputField from "@/components/form/DateInputField";
import { Pencil } from "lucide-react";

const WEEKS = ["일", "월", "화", "수", "목", "금", "토"];

export default function MeetingCreateStep2() {
  const router = useRouter();

  const { control, setValue, formState, trigger } = useFormContext<CreateMeetingFormValues>();
  const roundCount = useWatch({ control, name: "roundCount", defaultValue: 1 });
  const rounds = useWatch({ control, name: "rounds", defaultValue: [] });
  const time = useWatch({
    control,
    name: "time",
    defaultValue: { startTime: "", endTime: "" },
  });
  const durationMinutes = useWatch({ control, name: "durationMinutes", defaultValue: 0 });
  const booksByRound = useWatch({ control, name: "booksByRound", defaultValue: [] });
  const firstRoundAt = useWatch({
    control,
    name: "firstRoundAt",
    defaultValue: "",
  });
  const [meetingWeekday, setMeetingWeekday] = useState<number | null>(null);

  useEffect(() => {
    if (rounds.length !== roundCount) {
      const nextRounds = Array.from({ length: roundCount }, (_, i) => ({
        roundNo: i + 1,
        date: rounds.find((r) => r.roundNo === i + 1)?.date ?? "",
      }));
      const nextBooks = Array.from({ length: roundCount }, (_, i) => ({
        roundNo: i + 1,
        book: booksByRound.find((b) => b.roundNo === i + 1)?.book ?? null,
      }));
      setValue("rounds", nextRounds, { shouldDirty: true });
      setValue("booksByRound", nextBooks, { shouldDirty: true });
    }
  }, [booksByRound, roundCount, rounds, setValue]);

  useEffect(() => {
    if (!firstRoundAt || meetingWeekday === null) return;
    const nextRounds = calculateRoundDates(firstRoundAt, meetingWeekday, roundCount);
    if (nextRounds.length) {
      setValue("rounds", nextRounds, { shouldDirty: true });
    }
  }, [firstRoundAt, meetingWeekday, roundCount, setValue]);

  useEffect(() => {
    if (!time.startTime || durationMinutes <= 0) return;
    const nextEnd = calculateEndTime(time.startTime, durationMinutes);
    if (nextEnd && nextEnd !== time.endTime) {
      setValue("time", { ...time, endTime: nextEnd }, { shouldDirty: true });
    }
  }, [durationMinutes, setValue, time]);

  const weekdayOptions = useMemo(() => WEEKS.map((label, idx) => ({ id: idx, name: label })), []);

  const goNext = async () => {
    const isValid = await trigger(["rounds", "time", "recruitmentDeadline"], {
      shouldFocus: true,
    });
    if (isValid) {
      router.push("/meeting/create/book");
    }
  };

  const roundsError =
    (formState.errors?.rounds as { message?: string } | undefined)?.message ||
    (formState.errors?.rounds?.[0] as { date?: { message?: string } } | undefined)?.date?.message;
  const timeError =
    (formState.errors?.time as { message?: string; startTime?: { message?: string } } | undefined)
      ?.message ||
    (formState.errors?.time as { startTime?: { message?: string } } | undefined)?.startTime
      ?.message ||
    (formState.errors?.time as { endTime?: { message?: string } } | undefined)?.endTime?.message;
  const recruitmentDeadlineError = formState.errors?.recruitmentDeadline?.message as
    | string
    | undefined;
  const [editingRound, setEditingRound] = useState<number | null>(null);
  const [weekdayMissingError, setWeekdayMissingError] = useState<string | null>(null);
  const [weekdayMismatchError, setWeekdayMismatchError] = useState<{
    roundNo: number;
    message: string;
  } | null>(null);

  const handleRoundDateChange = (roundNo: number, nextDate: string) => {
    if (meetingWeekday === null) return;
    const day = new Date(nextDate).getDay();
    if (Number.isNaN(day) || day !== meetingWeekday) {
      setWeekdayMismatchError({
        roundNo,
        message: "선택한 요일과 일치하는 날짜만 선택할 수 있어요.",
      });
      return;
    }
    setWeekdayMismatchError(null);
    setWeekdayMissingError(null);
    const nextRounds = rounds.map((round) =>
      round.roundNo === roundNo ? { ...round, date: nextDate } : round,
    );
    setValue("rounds", nextRounds, { shouldDirty: true });
    setEditingRound(null);
  };

  return (
    <div className="flex flex-1 flex-col space-y-8">
      <NumberStepper
        label="모임 횟수"
        helperText="모집 횟수는 최소 1회 최대 8회로 제한됩니다."
        name="roundCount"
        min={1}
        max={8}
        step={1}
      />

      <RadioGroup<{ meetingWeekday: number }>
        name="meetingWeekday"
        label="모임 진행 요일"
        helperText="모임은 주 1회로 진행됩니다."
        options={weekdayOptions}
        variant="pill-sm"
        onChange={(value) => {
          setMeetingWeekday(value as number);
          setWeekdayMissingError(null);
        }}
      />

      <section className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <label className="text-base font-semibold text-gray-900">모임 진행 시간</label>
          <p className="mt-1 text-xs text-gray-400">모임 진행은 30분으로 고정입니다.</p>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <input
            type="time"
            value={time.startTime}
            onChange={(e) => {
              const nextStart = e.target.value;
              const nextEnd = calculateEndTime(nextStart, 30);
              setValue("time", { startTime: nextStart, endTime: nextEnd }, { shouldDirty: true });
            }}
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm"
          />
          <span className="text-body-emphasis text-gray-500">~</span>
          <input
            type="time"
            value={time.endTime}
            onChange={(e) =>
              setValue("time", { ...time, endTime: e.target.value }, { shouldDirty: true })
            }
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm"
          />
        </div>
        {timeError ? <p className="text-xs text-red-500">{timeError}</p> : null}
      </section>

      <DateInputField<CreateMeetingFormValues>
        name="firstRoundAt"
        label="시작 날짜 선택"
        errorMessage={roundsError}
      />

      {rounds.length ? (
        <section className="flex flex-col gap-4">
          <div className="flex flex-row gap-2">
            <label className="text-base font-semibold text-gray-900">최종 모임 일정</label>
            <p className="mt-1 text-xs text-gray-400">모임 진행은 30분으로 고정입니다.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 px-4 py-3 text-body-2 text-gray-600">
            {rounds.map((round) => (
              <div key={round.roundNo} className="py-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    {round.roundNo}회차 · {round.date || "날짜 미정"}
                  </div>
                  {editingRound === round.roundNo ? (
                    <input
                      type="date"
                      value={round.date}
                      onChange={(e) => handleRoundDateChange(round.roundNo, e.target.value)}
                      onBlur={() => setEditingRound(null)}
                      className="rounded-xl border border-gray-300 px-3 py-1 text-xs text-gray-700"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (meetingWeekday === null) {
                          setWeekdayMissingError(
                            "모임 진행 요일을 먼저 선택한 뒤 날짜를 수정할 수 있어요.",
                          );
                          return;
                        }
                        setEditingRound(round.roundNo);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`${round.roundNo}회차 날짜 수정`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
                {weekdayMismatchError?.roundNo === round.roundNo ? (
                  <p className="mt-1 text-xs text-red-500">{weekdayMismatchError.message}</p>
                ) : null}
              </div>
            ))}
          </div>
          {weekdayMissingError ? (
            <p className="text-xs text-red-500">{weekdayMissingError}</p>
          ) : null}
        </section>
      ) : null}

      <DateInputField<CreateMeetingFormValues>
        name="recruitmentDeadline"
        label="모집 마감일"
        helperText="모집은 마감일 23시 59분에 마감됩니다."
        errorMessage={recruitmentDeadlineError}
      />

      <button
        type="button"
        onClick={goNext}
        className="mt-auto w-full rounded-full bg-[var(--color-primary-purple)] py-4 text-sm font-semibold text-white"
      >
        다음
      </button>
    </div>
  );
}
