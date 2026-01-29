"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/layout/PageHeader";
import { apiFetch } from "@/lib/api/apiFetch";
import { Spinner } from "@/components/ui/spinner";
import WarningConfirmModal from "@/components/common/WarningConfirmModal";

type BookReportResponse = {
  book: {
    title: string;
    authors: string;
    publisher: string;
    thumbnailUrl: string;
    publishedAt: string;
  };
  bookReport: {
    id: number | null;
    status:
      | "NOT_SUBMITTED"
      | "DEADLINE_PASSED"
      | "PENDING_REVIEW"
      | "APPROVED"
      | "REJECTED"
      | "SUBMITTED";
    content: string | null;
    rejectionReason: string | null;
  };
};

export default function BookReportPage() {
  const params = useParams<{ roundId?: string }>();
  const roundId = params?.roundId ? Number(params.roundId) : null;
  const router = useRouter();

  const [data, setData] = useState<BookReportResponse | null>(null);
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftOpen, setIsDraftOpen] = useState(false);
  const [isDraftClosing, setIsDraftClosing] = useState(false);

  const storageKey = useMemo(() => (roundId ? `bookReport:draft:${roundId}` : null), [roundId]);
  const MIN_LENGTH = 400;
  const MAX_LENGTH = 1000;

  useEffect(() => {
    if (!roundId) return;
    const run = async () => {
      try {
        const response = await apiFetch<BookReportResponse>(
          `/meeting-rounds/${roundId}/book-reports/me`,
          {},
        );
        setData(response);
        setContent(response.bookReport.content ?? "");
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [roundId]);

  useEffect(() => {
    if (!storageKey) return;
    if (!data) return;
    if (data.bookReport.status !== "NOT_SUBMITTED") return;
    if (data.bookReport.content) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setIsDraftOpen(true);
    }
  }, [data, storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    if (!content) return;
    localStorage.setItem(storageKey, content);
  }, [content, storageKey]);

  const currentLength = content.length;

  const handleSubmit = async () => {
    if (!roundId) return;
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await apiFetch(`/meeting-rounds/${roundId}/book-reports`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      if (storageKey) {
        localStorage.removeItem(storageKey);
      }
      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title="독후감 제출" />
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="size-8 text-gray-400" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title="독후감 제출" />
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          독후감을 불러오지 못했어요.
        </div>
      </div>
    );
  }

  const isLocked =
    data.bookReport.status === "DEADLINE_PASSED" ||
    data.bookReport.status === "PENDING_REVIEW" ||
    data.bookReport.status === "SUBMITTED" ||
    data.bookReport.status === "APPROVED";
  const canSubmit = !isLocked && currentLength >= MIN_LENGTH && currentLength <= MAX_LENGTH;

  const submitLabel = {
    NOT_SUBMITTED: "독후감 제출하기",
    DEADLINE_PASSED: "독후감 제출 기한이 지났습니다.",
    PENDING_REVIEW: "AI 독후감 검증 중입니다.",
    APPROVED: "정상적으로 승인되었습니다.",
    REJECTED: "독후감 재제출하기",
    SUBMITTED: "AI 독후감 검증 중입니다.",
  }[data.bookReport.status];

  return (
    <div className="flex h-dvh flex-col bg-white">
      <PageHeader title="독후감 제출" />
      <div className="flex min-h-0 flex-1 flex-col px-6 pb-8 pt-6">
        <div className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4">
          <div className="h-20 w-16 overflow-hidden rounded-xl bg-gray-100">
            {data.book.thumbnailUrl ? (
              <img
                src={data.book.thumbnailUrl}
                alt={data.book.title}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">{data.book.publisher}</p>
            <p className="text-sm font-semibold text-gray-900">{data.book.title}</p>
            <p className="text-xs text-gray-500">{data.book.authors}</p>
            <p className="text-xs text-gray-400">{data.book.publishedAt}</p>
          </div>
        </div>

        <div className="mt-2 space-y-2">
          <textarea
            value={content}
            onChange={(e) => {
              const next = e.target.value.slice(0, MAX_LENGTH);
              setErrorMessage(null);
              setContent(next);
            }}
            disabled={isLocked}
            className="min-h-[400px] w-full rounded-2xl border border-gray-200 mt-2 px-4 py-3 text-sm text-gray-900 outline-none"
            placeholder="독후감을 작성해주세요."
          />
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>공백 포함 최소 {MIN_LENGTH}자</span>
            <span>
              {currentLength}/{MAX_LENGTH}
            </span>
          </div>
          {data.bookReport.rejectionReason ? (
            <p className="text-label text-red-500">반려 사유: {data.bookReport.rejectionReason}</p>
          ) : null}
        </div>
        <div className="mt-auto pt-6">
          <button
            type="button"
            disabled={!canSubmit || isSubmitting}
            onClick={handleSubmit}
            className={`h-12 w-full rounded-xl text-sm font-semibold ${
              data.bookReport.status === "APPROVED"
                ? "bg-primary-purple text-white"
                : canSubmit
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-500"
            }`}
          >
            {isSubmitting ? "제출 중..." : submitLabel}
          </button>
        </div>
      </div>

      <WarningConfirmModal
        isOpen={isDraftOpen}
        isClosing={isDraftClosing}
        title="작성 중인 글을 불러올까요?"
        description="이전에 작성하던 독후감이 저장되어 있어요."
        confirmLabel="불러오기"
        cancelLabel="삭제"
        onClose={() => {
          setIsDraftClosing(true);
          window.setTimeout(() => {
            setIsDraftClosing(false);
            setIsDraftOpen(false);
          }, 200);
        }}
        onConfirm={() => {
          const saved = storageKey ? localStorage.getItem(storageKey) : null;
          if (saved) {
            setContent(saved);
          }
          setIsDraftClosing(true);
          window.setTimeout(() => {
            setIsDraftClosing(false);
            setIsDraftOpen(false);
          }, 200);
        }}
      />
    </div>
  );
}
