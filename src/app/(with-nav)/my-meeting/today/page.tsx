"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import type { PolicyOption } from "@/components/onboarding/model/stepInfo";

import PageHeader from "@/components/layout/PageHeader";
import MyMeetingCard from "@/components/my/meeting/MyMeetingCard";
import { apiFetch } from "@/lib/api/apiFetch";

type MyMeetingItem = {
  meetingId: number;
  meetingImagePath: string;
  title: string;
  readingGenreId: number | string;
  leaderNickname: string;
  currentRound: number;
  meetingDate: string;
};

type MyMeetingListResponse = {
  items: MyMeetingItem[];
  pageInfo: {
    nextCursorId: number | null;
    hasNext: boolean;
    size: number;
  };
};

export default function MyMeetingTodayPage() {
  const { data: genres } = useQuery<PolicyOption[]>({
    queryKey: ["policy", "/policies/reading-genres"],
    queryFn: () => apiFetch<PolicyOption[]>("/policies/reading-genres", {}),
    staleTime: 1000 * 60 * 60,
  });

  const genreMap = useMemo(() => new Map(genres?.map((genre) => [genre.id, genre.name])), [genres]);

  const { data, isLoading, isError } = useQuery<MyMeetingListResponse>({
    queryKey: ["my-meetings", "today", "all"],
    queryFn: () => apiFetch<MyMeetingListResponse>("/users/me/meetings/today", {}),
  });

  const items = data?.items ?? [];

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="오늘의 모임" />
      <div className="flex flex-1 flex-col px-6 pb-10">
        {isLoading ? (
          <div className="py-10 text-center text-sm text-gray-400">
            오늘의 모임을 불러오는 중...
          </div>
        ) : null}
        {isError ? (
          <div className="py-10 text-center text-sm text-gray-400">
            오늘의 모임을 불러오지 못했어요.
          </div>
        ) : null}
        {items.length ? (
          <div className="mt-6 grid grid-cols-2 gap-4">
            {items.map((item) => (
              <MyMeetingCard
                key={item.meetingId}
                meetingId={item.meetingId}
                meetingImagePath={item.meetingImagePath}
                title={item.title}
                genreName={genreMap.get(Number(item.readingGenreId))}
                leaderNickname={item.leaderNickname}
                currentRound={item.currentRound}
                meetingDate={item.meetingDate}
              />
            ))}
          </div>
        ) : !isLoading && !isError ? (
          <p className="py-10 text-center text-sm text-gray-400">오늘 진행되는 모임이 없어요.</p>
        ) : null}
      </div>
    </div>
  );
}
