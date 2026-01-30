"use client";

import WarningConfirmModal from "@/components/common/WarningConfirmModal";
import MainHeader from "@/components/layout/MainHeader";
import MyMeetingCard from "@/components/my/meeting/MyMeetingCard";
import {
  MyMeetingItem,
  MyMeetingListResponse,
  STATUS_TABS,
  StatusValue,
} from "@/components/my/meeting/types";
import { PolicyOption } from "@/components/onboarding/model/stepInfo";
import { apiFetch } from "@/lib/api/apiFetch";
import { useAuthStore } from "@/stores/authStore";
import { InfiniteData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export default function MyMeeting() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [status, setStatus] = useState<StatusValue>("ACTIVE");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { data: genres } = useQuery<PolicyOption[]>({
    queryKey: ["policy", "/policies/reading-genres"],
    queryFn: () => apiFetch<PolicyOption[]>("/policies/reading-genres", {}),
    staleTime: 1000 * 60 * 60,
  });

  const genreMap = useMemo(() => new Map(genres?.map((genre) => [genre.id, genre.name])), [genres]);

  const { data: todayData, isLoading: isTodayLoading } = useQuery<MyMeetingListResponse>({
    queryKey: ["my-meetings", "today"],
    queryFn: () => apiFetch<MyMeetingListResponse>("/users/me/meetings/today", {}),
    staleTime: 1000 * 60,
  });

  const todayItems = todayData?.items ?? [];
  const hasMoreToday = (todayData?.pageInfo?.hasNext ?? false) || todayItems.length > 2;
  const todayPreview = todayItems.slice(0, 2);

  const {
    data: meetingPages,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    MyMeetingListResponse,
    Error,
    InfiniteData<MyMeetingListResponse>,
    (string | StatusValue)[],
    number | undefined
  >({
    queryKey: ["my-meetings", status],
    queryFn: async ({ pageParam }) => {
      const cursorParam = pageParam ? `&cursorId=${pageParam}` : "";
      const url = `/users/me/meetings?status=${status}&size=10${cursorParam}`;
      return await apiFetch<MyMeetingListResponse>(url, {});
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNext ? lastPage.pageInfo.nextCursorId : undefined,
  });

  const meetings = useMemo(() => {
    const flattened =
      meetingPages?.pages.flatMap((page: MyMeetingListResponse) =>
        page.items.map((item) => ({
          ...item,
          readingGenreId: Number(item.readingGenreId),
        })),
      ) ?? [];

    const unique = new Map<number, MyMeetingItem>();
    for (const item of flattened) {
      if (!unique.has(item.meetingId)) {
        unique.set(item.meetingId, item);
      }
    }

    return Array.from(unique.values());
  }, [meetingPages?.pages]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "120px", threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (!accessToken) {
    return (
      <WarningConfirmModal
        isOpen={!accessToken}
        isClosing={false}
        title="로그인이 필요해요!"
        description="로그인 후 더 많은 독토리 서비스를 이용해보세요."
        confirmLabel="로그인하기"
        cancelLabel="홈으로"
        onConfirm={() => router.push("/oauth")}
        onClose={() => router.push("/")}
      />
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-20 bg-white">
        <MainHeader hasUnread />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-10">
        <div className="mt-6 flex items-center justify-between">
          <p className="text-subheading text-gray-900">Today</p>
          {hasMoreToday ? (
            <Link href="/my-meeting/today" className="text-sm text-gray-500">
              더보기 &gt;
            </Link>
          ) : null}
        </div>
        <div className="mt-5">
          {isTodayLoading ? (
            <p className="py-6 text-center text-sm text-gray-400">오늘의 모임을 불러오는 중...</p>
          ) : todayPreview.length ? (
            <div className="grid grid-cols-2 gap-4">
              {todayPreview.map((item) => (
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
          ) : (
            <p className="py-6 text-center text-sm text-gray-400">오늘 진행되는 모임이 없어요.</p>
          )}
        </div>

        <div className="mt-8 flex items-center gap-5 border-b border-gray-200 text-sm font-semibold text-gray-400">
          {STATUS_TABS.map((tab) => {
            const isActive = status === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatus(tab.value)}
                className={`relative pb-3 ${isActive ? "text-gray-900" : "text-gray-400"}`}
              >
                {tab.label}
                {isActive ? (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-14 -translate-x-1/2 bg-gray-900" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-1 flex-col">
          {isLoading ? (
            <div className="py-10 text-center text-sm text-gray-400">모임을 불러오는 중...</div>
          ) : null}
          {isError ? (
            <div className="py-10 text-center text-sm text-gray-400">모임을 불러오지 못했어요.</div>
          ) : null}
          {meetings.length ? (
            <div key={status} className="grid grid-cols-2 gap-4 animate-fade-in-up">
              {meetings.map((item) => (
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
            <p key={status} className="py-10 text-center text-sm text-gray-400 animate-fade-in-up">
              모임이 없습니다.
            </p>
          ) : null}
          {isFetchingNextPage ? (
            <div className="py-6 text-center text-xs text-gray-400">더 불러오는 중...</div>
          ) : null}
          {hasNextPage ? <div ref={sentinelRef} className="h-2" /> : null}
        </div>
      </div>
    </div>
  );
}
