"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import MeetingFilterBar from "@/components/meeting/MeetingFilterBar";
import { apiFetch } from "@/lib/api/apiFetch";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import type { PolicyOption } from "@/components/onboarding/model/stepInfo";
import { MeetingItem } from "@/components/meeting/MeetingItem";
import type { MeetingItemData } from "@/components/meeting/types";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type MeetingListResponse = {
  items: MeetingItemData[];
  pageInfo: {
    nextCursorId: number | null;
    hasNext: boolean;
    size: number;
  };
};

type FilterState = {
  roundCountCode: string | null;
  dayOfWeekCodes: string[];
  startTimeCodes: string[];
  topicCodes: string[];
};

const scheduleOptions = [
  { code: "ONE", name: "1회" },
  { code: "THREE_OR_MORE", name: "3회 이상" },
  { code: "FIVE_OR_MORE", name: "5회 이상" },
];

const dayOptions = [
  { code: "MON", name: "월" },
  { code: "TUE", name: "화" },
  { code: "WED", name: "수" },
  { code: "THU", name: "목" },
  { code: "FRI", name: "금" },
  { code: "SAT", name: "토" },
  { code: "SUN", name: "일" },
];

const timeOptions = [
  { code: "MORNING", name: "아침" },
  { code: "AFTERNOON", name: "점심" },
  { code: "EVENING", name: "저녁" },
];

function buildMeetingQuery(filter: FilterState, cursorId?: number) {
  const params = new URLSearchParams();
  params.set("size", "10");
  if (cursorId) params.set("cursorId", String(cursorId));

  if (filter.roundCountCode) {
    params.set("roundCount", filter.roundCountCode);
  }

  if (filter.dayOfWeekCodes.length > 0) {
    params.set("dayOfWeek", filter.dayOfWeekCodes.join(","));
  }

  filter.startTimeCodes.forEach((code) => params.append("startTimeFrom", code));

  const topicCode = filter.topicCodes[0];
  if (topicCode) {
    params.set("readingGenre", topicCode);
  }

  return params.toString();
}

type StoredSearchState = {
  filter?: FilterState;
  submittedKeyword?: string;
  keyword?: string;
};

function readStoredState(): { state: StoredSearchState | null; shouldRestore: boolean } {
  if (typeof window === "undefined") return { state: null, shouldRestore: false };
  const shouldRestore = sessionStorage.getItem("meetingSearch:restore") === "1";
  if (!shouldRestore) {
    return { state: null, shouldRestore: false };
  }
  const stored = sessionStorage.getItem("meetingSearch:state");
  if (!stored) {
    return { state: null, shouldRestore: true };
  }
  try {
    return { state: JSON.parse(stored) as StoredSearchState, shouldRestore: true };
  } catch {
    return { state: null, shouldRestore: true };
  }
}

export default function MeetingSearch() {
  const [initialState] = useState(() => readStoredState());

  const initialFilter =
    initialState.state?.filter ??
    ({
      roundCountCode: null,
      dayOfWeekCodes: [],
      startTimeCodes: [],
      topicCodes: [],
    } as FilterState);
  const initialSubmittedKeyword = initialState.state?.submittedKeyword ?? "";
  const initialKeyword = initialState.state?.keyword ?? initialState.state?.submittedKeyword ?? "";
  const initialHasApplied =
    Boolean(initialState.state?.filter) || initialSubmittedKeyword.trim().length > 0;

  const [filter, setFilter] = useState<FilterState>(initialFilter);
  const [hasApplied, setHasApplied] = useState(initialHasApplied);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [submittedKeyword, setSubmittedKeyword] = useState(initialSubmittedKeyword);
  const [keywordError, setKeywordError] = useState<string | null>(null);

  const { data: genres } = useQuery<PolicyOption[]>({
    queryKey: ["policy", "/policies/reading-genres"],
    queryFn: () => apiFetch<PolicyOption[]>("/policies/reading-genres", {}),
    staleTime: 1000 * 60 * 60,
  });

  const topicOptions = useMemo(
    () => (genres ?? []).map((genre) => ({ code: genre.code, name: genre.name })),
    [genres],
  );

  const listRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialState.shouldRestore) {
      sessionStorage.removeItem("meetingSearch:restore");
      return;
    }
    sessionStorage.removeItem("meetingSearch:state");
  }, [initialState]);

  const hasActiveFilters =
    Boolean(filter.roundCountCode) ||
    filter.dayOfWeekCodes.length > 0 ||
    filter.startTimeCodes.length > 0 ||
    filter.topicCodes.length > 0 ||
    submittedKeyword.trim().length > 0;

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
    [string, FilterState, string],
    number | undefined
  >({
    queryKey: ["meetingSearch", filter, submittedKeyword],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams(buildMeetingQuery(filter, pageParam));
      const hasKeyword = submittedKeyword.trim().length > 0;
      if (hasKeyword) {
        params.set("keyword", submittedKeyword.trim());
      }
      const url = hasKeyword
        ? `/meetings/search?${params.toString()}`
        : `/meetings?${params.toString()}`;
      return await apiFetch<MeetingListResponse>(url, {});
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNext ? lastPage.pageInfo.nextCursorId : undefined,
    enabled: hasApplied && hasActiveFilters,
  });

  const meetings = useMemo(() => {
    const flattened =
      meetingPages?.pages.flatMap((page) =>
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
    const root = listRef.current;
    const target = sentinelRef.current;
    if (!root || !target) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { root, rootMargin: "120px", threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return (
    <div className="relative flex h-dvh flex-col bg-white">
      <PageHeader title="모임 검색" />
      <div className="flex min-h-0 flex-1 flex-col px-6 pb-8 pt-6 space-y-6">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const nextKeyword = keyword.trim();
            if (!nextKeyword && !hasActiveFilters) {
              setKeywordError("검색어를 입력해주세요");
              return;
            }
            setKeywordError(null);
            setSubmittedKeyword(nextKeyword);
            setHasApplied(true);
            sessionStorage.setItem(
              "meetingSearch:state",
              JSON.stringify({
                filter,
                submittedKeyword: nextKeyword,
                keyword: nextKeyword,
              }),
            );
          }}
          className="flex"
        >
          <div className="flex w-full items-center gap-3 rounded-full bg-gray-100 px-4 py-3 text-gray-500">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                if (keywordError) {
                  setKeywordError(null);
                }
              }}
              className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
              placeholder="모임명/키워드로 검색하기"
            />
          </div>
        </form>
        <MeetingFilterBar
          scheduleOptions={scheduleOptions}
          dayOptions={dayOptions}
          timeOptions={timeOptions}
          topicOptions={topicOptions}
          onApply={(next) => {
            setFilter(next);
            setHasApplied(true);
            sessionStorage.setItem(
              "meetingSearch:state",
              JSON.stringify({
                filter: next,
                submittedKeyword,
                keyword,
              }),
            );
          }}
        />
        <div ref={listRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {keywordError ? (
            <div className="py-10 text-center text-sm text-gray-400">{keywordError}</div>
          ) : !hasApplied ? (
            <div className="py-10 text-center text-sm text-gray-400">
              일정 또는 주제를 선택해 검색해보세요.
            </div>
          ) : null}
          {isLoading ? (
            <div className="py-10 text-center text-sm text-gray-400">불러오는 중...</div>
          ) : null}
          {isError ? (
            <div className="py-10 text-center text-sm text-gray-400">모임을 불러오지 못했어요.</div>
          ) : null}
          {hasApplied && !isLoading && !isError && meetings.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              원하는 조건의 모임이 없어요.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {meetings.map((meeting) => (
                <MeetingItem
                  key={meeting.meetingId}
                  meeting={meeting}
                  genreName={genreMap.get(meeting.readingGenreId)}
                  onClick={() => {
                    sessionStorage.setItem("meetingSearch:restore", "1");
                    sessionStorage.setItem(
                      "meetingSearch:state",
                      JSON.stringify({
                        filter,
                        submittedKeyword,
                        keyword,
                      }),
                    );
                  }}
                />
              ))}
            </div>
          )}
          {isFetchingNextPage ? (
            <div className="py-6 text-center text-xs text-gray-400">더 불러오는 중...</div>
          ) : null}
          {hasNextPage ? <div ref={sentinelRef} className="h-2" /> : null}
        </div>
      </div>
    </div>
  );
}
