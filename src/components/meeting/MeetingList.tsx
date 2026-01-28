"use client";

import { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api/apiFetch";
import type { PolicyOption } from "../onboarding/model/stepInfo";
import { MeetingItem } from "./MeetingItem";
import { MeetingItemData } from "./types";

type MeetingListResponse = {
  items: MeetingItemData[];
  pageInfo: {
    nextCursorId: number | null;
    hasNext: boolean;
    size: number;
  };
};

export default function MeetingList() {
  const { data: genres } = useQuery<PolicyOption[]>({
    queryKey: ["policy", "/policies/reading-genres"],
    queryFn: () => apiFetch<PolicyOption[]>("/policies/reading-genres", {}),
    staleTime: 1000 * 60 * 60,
  });

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    data: meetingPages,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    MeetingListResponse,
    Error,
    InfiniteData<MeetingListResponse>,
    string[],
    number | undefined
  >({
    queryKey: ["meetings"],
    queryFn: async ({ pageParam }) => {
      const cursorParam = pageParam ? `&cursorId=${pageParam}` : "";
      const url = `/meetings?size=6${cursorParam}`;
      return await apiFetch<MeetingListResponse>(url, {});
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNext ? lastPage.pageInfo.nextCursorId : undefined,
  });

  const meetings = useMemo(() => {
    const flattened =
      meetingPages?.pages.flatMap((page: MeetingListResponse) =>
        page.items.map((item) => ({
          ...item,
          readingGenreId: Number(item.readingGenreId),
        })),
      ) ?? [];

    const unique = new Map<number, MeetingItemData>();
    for (const item of flattened) {
      if (!unique.has(item.meetingId)) {
        unique.set(item.meetingId, item);
      }
    }

    return Array.from(unique.values());
  }, [meetingPages?.pages]);

  const genreMap = useMemo(() => new Map(genres?.map((genre) => [genre.id, genre.name])), [genres]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="px-6 my-10">
      <div className="flex flex-col gap-1">
        <p className="text-subheading">전체 모임</p>
        <p className="text-label !font-[400] text-gray-400">취향에 맞는 모임을 탐색해보세요!</p>
      </div>
      <div className="mt-5 flex min-h-0 flex-1 flex-col">
        {isLoading ? (
          <div className="py-10 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : null}
        {isError ? (
          <div className="py-10 text-center text-sm text-gray-400">모임을 불러오지 못했어요.</div>
        ) : null}
        <div className="grid grid-cols-2 gap-4">
          {meetings.map((meeting) => (
            <MeetingItem
              key={meeting.meetingId}
              meeting={meeting}
              genreName={genreMap.get(meeting.readingGenreId)}
            />
          ))}
        </div>
        {isFetchingNextPage ? (
          <div className="py-6 text-center text-xs text-gray-400">더 불러오는 중...</div>
        ) : null}
        {hasNextPage ? <div ref={sentinelRef} className="h-2" /> : null}
      </div>
    </div>
  );
}
