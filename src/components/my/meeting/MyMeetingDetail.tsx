"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import PageHeader from "@/components/layout/PageHeader";
import { apiFetch } from "@/lib/api/apiFetch";
import { Spinner } from "@/components/ui/spinner";
import formatKoreanDate from "@/lib/formatKoreanDate";
import { MyMeetingDetailResponse } from "./types";

export default function MyMeetingDetail() {
  const params = useParams<{ meetingId?: string }>();
  const meetingId = params?.meetingId ? Number(params.meetingId) : null;
  const router = useRouter();

  const { data, isLoading, isError } = useQuery<MyMeetingDetailResponse>({
    queryKey: ["myMeetingDetail", meetingId],
    queryFn: () => apiFetch<MyMeetingDetailResponse>(`/users/me/meetings/${meetingId}`, {}),
    enabled: Boolean(meetingId),
  });

  const [activeRoundNo, setActiveRoundNo] = useState<number | null>(null);

  const rounds = useMemo(() => data?.rounds ?? [], [data?.rounds]);
  const defaultRoundNo = useMemo(() => {
    const upcoming = rounds.filter((round) => round.dday >= 0);
    if (upcoming.length) {
      upcoming.sort((a, b) => a.dday - b.dday);
      return upcoming[0].roundNo;
    }
    return data?.currentRoundNo ?? rounds[0]?.roundNo ?? 1;
  }, [rounds, data?.currentRoundNo]);
  const resolvedRoundNo = activeRoundNo ?? defaultRoundNo;
  const activeRound = useMemo(
    () => rounds.find((round) => round.roundNo === resolvedRoundNo) ?? rounds[0],
    [resolvedRoundNo, rounds],
  );
  const meetingEndPassed = (activeRound?.dday ?? 0) < 0;
  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title="나의 모임" />
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="size-8 text-gray-400" />
        </div>
      </div>
    );
  }

  if (isError || !data || !activeRound) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title="나의 모임" />
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          모임 정보를 불러오지 못했어요.
        </div>
      </div>
    );
  }

  const hasMeetingLink = Boolean(activeRound.meetingLink);
  const canJoin = Boolean(activeRound.canJoinMeeting);
  const joinLabel = meetingEndPassed
    ? "종료된 모임입니다."
    : !hasMeetingLink
      ? "현재는 참여 가능 시간이 아닙니다."
      : canJoin
        ? "모임 참여하기"
        : "독후감 미제출로 이번 모임은 참여하실 수 없어요.";
  const joinButtonClass =
    !meetingEndPassed && hasMeetingLink && canJoin
      ? "bg-primary-purple text-white"
      : "bg-gray-200 text-gray-500";

  const reportStatusKey = activeRound.bookReport.status ?? "NOT_SUBMITTED";
  const reportStatusLabel: Record<string, string> = {
    NOT_SUBMITTED: "미제출",
    SUBMITTED: "제출됨",
    APPROVED: "승인됨",
    REJECTED: "반려됨",
  };

  const reportStatusClass: Record<string, string> = {
    NOT_SUBMITTED: "bg-gray-200 text-gray-600",
    SUBMITTED: "bg-orange-100 text-orange-600",
    APPROVED: "bg-green-100 text-green-600",
    REJECTED: "bg-red-100 text-red-600",
  };

  const reportActionLabel: Record<string, string> = {
    NOT_SUBMITTED: "독후감 제출하기",
    SUBMITTED: "독후감 확인하기",
    APPROVED: "독후감 확인하기",
    REJECTED: "독후감 반려 사유 확인하기",
  };

  const meetingTimeLabel = activeRound.meetingDate ? activeRound.meetingDate.slice(11, 16) : "";

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <div className="sticky top-0 z-20 bg-white">
        <PageHeader title="나의 모임" />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="relative aspect-[4/3] w-full bg-gray-100">
          {data.meetingImagePath ? (
            <img
              src={data.meetingImagePath}
              alt={`${data.title} 대표 이미지`}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-gray-900">{data.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {data.readingGenreName}
              </span>
              <span>
                모임멤버{" "}
                <span className="font-semibold text-gray-900">
                  {data.currentMemberCount}/{data.capacity}명
                </span>
              </span>
            </div>
          </div>

          <section className="space-y-3 rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                {data.leaderInfo.profileImagePath ? (
                  <img
                    src={data.leaderInfo.profileImagePath}
                    alt={`${data.leaderInfo.nickname} 프로필`}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">모임장</p>
                <p className="text-sm text-gray-600">{data.leaderInfo.nickname}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>모임 날짜</span>
              <span className="font-semibold text-gray-900">
                {formatKoreanDate(activeRound.meetingDate.slice(0, 10))}
              </span>
              <span className="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-700">
                {activeRound.roundNo}회차
              </span>
            </div>
            {meetingTimeLabel ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>모임 시간</span>
                <span className="font-semibold text-gray-900">{meetingTimeLabel}</span>
              </div>
            ) : null}
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between rounded-xl border border-gray-300 px-3 py-2">
              <button
                type="button"
                onClick={() =>
                  setActiveRoundNo((prev) => Math.max(1, (prev ?? data.currentRoundNo) - 1))
                }
                className="flex h-8 w-8 items-center justify-center"
                aria-label="이전 회차"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
              </button>
              <span className="text-sm font-semibold text-gray-900">{activeRound.roundNo}회차</span>
              <button
                type="button"
                onClick={() =>
                  setActiveRoundNo((prev) =>
                    Math.min(data.roundCount, (prev ?? data.currentRoundNo) + 1),
                  )
                }
                className="flex h-8 w-8 items-center justify-center"
                aria-label="다음 회차"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            <div key={activeRound.roundNo} className="space-y-6 animate-fade-in-up">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-semibold text-gray-900">모임 참여하기</h2>
                  <span className="rounded-full bg-primary-purple px-2 py-1 text-micro !font-[600] text-white">
                    {activeRound.dday === 0
                      ? "Today"
                      : activeRound.dday > 0
                        ? `D - ${activeRound.dday}`
                        : `D + ${Math.abs(activeRound.dday)}`}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  모임 시작 10분 전부터 모임방이 활성화됩니다.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (meetingEndPassed || !hasMeetingLink || !canJoin || !activeRound.meetingLink)
                      return;
                    window.open(activeRound.meetingLink, "_blank");
                  }}
                  disabled={meetingEndPassed || !hasMeetingLink || !canJoin}
                  className={`h-12 w-full rounded-xl text-sm font-semibold ${joinButtonClass}`}
                >
                  {joinLabel}
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-semibold text-gray-900">독후감 제출하기</h2>
                  <span
                    className={`rounded-full px-2 py-1 text-micro ${
                      reportStatusClass[reportStatusKey]
                    }`}
                  >
                    {reportStatusLabel[reportStatusKey]}
                  </span>
                </div>
                <p className="text-xs text-gray-500">모임 시작 전까지 독후감을 제출해야합니다.</p>
                <div className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4">
                  <div className="h-20 w-16 overflow-hidden rounded-xl bg-gray-100">
                    {activeRound.book.thumbnailUrl ? (
                      <img
                        src={activeRound.book.thumbnailUrl}
                        alt={activeRound.book.title}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">{activeRound.book.publisher}</p>
                    <p className="text-sm font-semibold text-gray-900">{activeRound.book.title}</p>
                    <p className="text-xs text-gray-500">{activeRound.book.authors}</p>
                    <p className="text-xs text-gray-400">
                      {activeRound.book.publishedAt?.slice(0, 4)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => router.push(`/meeting-rounds/${activeRound.roundId}/book-report`)}
                  className="mt-5 h-12 w-full rounded-xl bg-gray-800 text-sm font-semibold text-white"
                >
                  {reportActionLabel[reportStatusKey]}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
