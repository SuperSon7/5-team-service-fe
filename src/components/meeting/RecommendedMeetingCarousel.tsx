"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import formatKoreanDate from "@/lib/formatKoreanDate";
import { apiFetch } from "@/lib/api/apiFetch";
import { useAuthStore } from "@/stores/authStore";

type RecommendedMeeting = {
  meetingId: number;
  meetingImagePath: string;
  title: string;
  readingGenreName: string;
  leaderNickname: string;
  recruitmentDeadline: string;
};

export default function RecommendedMeetingCarousel() {
  const initialized = useAuthStore((state) => state.initialized);
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery<RecommendedMeeting[]>({
    queryKey: ["recommendations", "meetings"],
    queryFn: () => apiFetch<RecommendedMeeting[]>("/recommendations/meetings", {}),
    staleTime: 1000 * 60 * 5,
    enabled: initialized,
  });

  const items = useMemo(() => response ?? [], [response]);
  const total = items.length;
  const extendedItems = useMemo(() => {
    if (total === 0) return [];
    return [items[total - 1], ...items, items[0]];
  }, [items, total]);
  const [activeIndex, setActiveIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    if (!isAnimating) return;
    if (activeIndex === total + 1) {
      const timer = window.setTimeout(() => {
        setIsAnimating(false);
        setActiveIndex(1);
      }, 350);
      return () => window.clearTimeout(timer);
    }
    if (activeIndex === 0) {
      const timer = window.setTimeout(() => {
        setIsAnimating(false);
        setActiveIndex(total);
      }, 350);
      return () => window.clearTimeout(timer);
    }
  }, [activeIndex, isAnimating, total]);

  const indicatorIndex = total ? (activeIndex - 1 + total) % total : 0;
  const canNavigate = total > 1;
  const goNext = useCallback(() => {
    if (!canNavigate) return;
    setActiveIndex((prev) => (prev >= total ? total + 1 : prev + 1));
    setIsAnimating(true);
  }, [canNavigate, total]);
  const goPrev = useCallback(() => {
    if (!canNavigate) return;
    setActiveIndex((prev) => (prev <= 1 ? 0 : prev - 1));
    setIsAnimating(true);
  }, [canNavigate, total]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = window.setInterval(() => {
      goNext();
    }, 4000);
    return () => window.clearInterval(timer);
  }, [goNext, total]);

  return (
    <div className="group relative">
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transition: isAnimating ? "transform 350ms ease" : "none",
          }}
        >
          {extendedItems.map((item, idx) => {
            return (
              <Link
                key={`${item.meetingId}-${idx}`}
                href={`/meeting/detail/${item.meetingId}`}
                aria-label={`${item.title} 모임 상세`}
                className="flex w-full shrink-0 items-center gap-4 border border-gray-100 bg-white pl-5 shadow-md"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="line-clamp-2 text-body-emphasis !text-[18px] font-semibold text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">{item.readingGenreName}</p>
                  <p className="text-body-2 text-gray-600">
                    모임장{" "}
                    <span className="font-semibold text-gray-900">{item.leaderNickname}</span>
                  </p>
                  <p className="text-body-2 text-gray-600">
                    모집 마감일{" "}
                    <span className="font-semibold text-gray-900">
                      {formatKoreanDate(item.recruitmentDeadline)}
                    </span>
                  </p>
                </div>
                <div className="relative h-40 w-60 shrink-0 overflow-hidden bg-gray-100">
                  <img
                    src={item.meetingImagePath}
                    alt={`${item.title} 이미지`}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-white to-transparent" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      {canNavigate ? (
        <>
          <div
            className="absolute inset-y-0 left-0 w-[30%] flex items-center"
            onMouseEnter={() => setHoverSide("left")}
            onMouseLeave={() => setHoverSide(null)}
          >
            {hoverSide === "left" ? (
              <button
                type="button"
                aria-label="이전 추천 모임"
                onClick={goPrev}
                className="ml-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-md transition hover:bg-white"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
            ) : null}
          </div>
          <div
            className="absolute inset-y-0 right-0 w-[30%] flex items-center justify-end"
            onMouseEnter={() => setHoverSide("right")}
            onMouseLeave={() => setHoverSide(null)}
          >
            {hoverSide === "right" ? (
              <button
                type="button"
                aria-label="다음 추천 모임"
                onClick={goNext}
                className="mr-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-md transition hover:bg-white"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </>
      ) : null}
      {isLoading ? (
        <div className="py-6 text-center text-sm text-gray-400">추천 모임을 불러오는 중...</div>
      ) : null}
      {isError ? (
        <div className="py-6 text-center text-sm text-gray-400">추천 모임을 불러오지 못했어요.</div>
      ) : null}
      {total > 1 ? (
        <div className="mt-3 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5">
            {items.map((item, index) => (
              <span
                key={item.meetingId}
                className={`rounded-full transition-all ${
                  index === indicatorIndex ? "h-1 w-4 bg-primary-purple" : "h-1 w-1 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
