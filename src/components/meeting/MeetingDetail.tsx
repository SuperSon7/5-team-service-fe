"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpenIcon } from "@heroicons/react/24/outline";

import { apiFetch } from "@/lib/api/apiFetch";
import type { PolicyOption } from "@/components/onboarding/model/stepInfo";
import PageHeader from "@/components/layout/PageHeader";
import { Spinner } from "@/components/ui/spinner";
import WarningConfirmModal from "@/components/common/WarningConfirmModal";
import { authStore } from "@/stores/authStore";
import { ApiErrorResponse } from "@/lib/api/types";
import formatKoreanDate from "@/lib/formatKoreanDate";
import { MeetingDetailResponse } from "./types";

export default function MeetingDetail() {
  const params = useParams<{ meetingId?: string }>();
  const meetingId = params?.meetingId ? Number(params.meetingId) : null;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isJoining, setIsJoining] = useState(false);
  const [modalType, setModalType] = useState<"login" | "notFound" | "already" | "blocked" | null>(
    null,
  );
  const [isClosing, setIsClosing] = useState(false);

  const { data: genres } = useQuery<PolicyOption[]>({
    queryKey: ["policy", "/policies/reading-genres"],
    queryFn: () => apiFetch<PolicyOption[]>("/policies/reading-genres", {}),
    staleTime: 1000 * 60 * 60,
  });

  const { data, isLoading, isError } = useQuery<MeetingDetailResponse>({
    queryKey: ["meetingDetail", meetingId],
    queryFn: () => apiFetch<MeetingDetailResponse>(`/meetings/${meetingId}`, {}),
    enabled: Boolean(meetingId),
  });

  const genreName = useMemo(() => {
    if (!data?.meeting.readingGenreId || !genres) return "기타";
    return genres.find((genre) => genre.id === data.meeting.readingGenreId)?.name ?? "기타";
  }, [data?.meeting.readingGenreId, genres]);

  const action = useMemo(() => {
    const status = data?.meeting.status;
    const participation = data?.participantsPreview.myParticipationStatus ?? "NONE";

    if (status === "FINISHED") {
      return { label: "종료된 모임입니다.", tone: "danger", disabled: true };
    }
    if (status && status !== "RECRUITING") {
      return { label: "모집이 마감되었습니다.", tone: "muted", disabled: true };
    }
    if (participation === "APPROVED") {
      return { label: "가입 완료", tone: "info", disabled: true };
    }
    if (participation === "PENDING") {
      return { label: "승인 대기중", tone: "muted", disabled: true };
    }
    return { label: "모임 가입하기", tone: "primary", disabled: false };
  }, [data?.meeting.status, data?.participantsPreview.myParticipationStatus]);

  const closeModal = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsClosing(false);
      setModalType(null);
    }, 200);
  };

  const handleJoin = async () => {
    if (!meetingId) return;
    const accessToken = authStore.getAccessToken();
    if (!accessToken) {
      setModalType("login");
      return;
    }
    if (action.disabled) return;

    setIsJoining(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!base) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
      }

      const response = await fetch(`${base}/meetings/${meetingId}/participations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 401) {
        setModalType("login");
        return;
      }

      const body = (await response.json()) as ApiErrorResponse;

      if (!response.ok) {
        if (body.code === "MEETING_NOT_FOUND") {
          setModalType("notFound");
          return;
        }
        if (body.code === "JOIN_REQUEST_ALREADY_EXISTS") {
          setModalType("already");
          return;
        }
        if (body.code === "JOIN_REQUEST_BLOCKED") {
          setModalType("blocked");
          return;
        }
        throw new Error(body.message ?? "모임 가입 요청에 실패했습니다.");
      }

      await queryClient.invalidateQueries({ queryKey: ["meetingDetail", meetingId] });
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title="모임 상세" />
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="size-8 text-gray-400" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title="모임 상세" />
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          모임 정보를 불러오지 못했어요.
        </div>
      </div>
    );
  }

  const { meeting, rounds, participantsPreview } = data;
  const deadline = formatKoreanDate(meeting.recruitmentDeadline);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white">
      <div className="sticky top-0 z-20 bg-white">
        <PageHeader title="모임 상세" />
      </div>
      <div className="flex-1 min-h-0 w-full overflow-y-auto pb-5">
        <div className="overflow-hidden">
          <div className="relative aspect-[4/3] w-full bg-gray-100">
            {meeting.meetingImagePath ? (
              <img
                src={meeting.meetingImagePath}
                alt={`${meeting.title} 대표 이미지`}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="space-y-4 p-5">
            <div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {genreName}
              </span>
              <h1 className="mt-3 text-xl font-semibold text-gray-900">{meeting.title}</h1>
              <p className="mt-2 text-sm text-gray-600">{meeting.description}</p>
            </div>

            <div className="flex flex-col gap-3 text-sm text-gray-700">
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                모집 현황{" "}
                <span className="font-semibold text-gray-900">{meeting.currentCount}</span>/
                <span className="font-semibold text-gray-900">{meeting.capacity}명</span>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                모임 회차{" "}
                <span className="font-semibold text-gray-900">{meeting.roundCount}회</span>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                진행 시간{" "}
                <span className="font-semibold text-gray-900">{meeting.time.startTime}</span>~
                <span className="font-semibold text-gray-900">{meeting.time.endTime}</span>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                모집 마감일 <span className="font-semibold text-gray-900">{deadline}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                  {meeting.leader.profileImagePath ? (
                    <img
                      src={meeting.leader.profileImagePath}
                      alt={`${meeting.leader.nickname} 프로필`}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    모임장 {meeting.leader.nickname}
                  </p>
                  <p className="text-xs text-gray-500 break-words">{meeting.leader.intro}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4 p-5">
          <h2 className="text-base font-semibold text-gray-900">모임 일정 & 도서</h2>
          <div className="space-y-3">
            {rounds.map((round) => (
              <div
                key={round.roundNo}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                  {round.roundNo}회차
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {formatKoreanDate(round.date)}
                  </p>
                  <p className="text-sm text-gray-600">{round.book.title}</p>
                  <p className="text-xs text-gray-500">
                    {round.book.authors} · {round.book.publisher}
                  </p>
                </div>
                <div className="h-14 w-10 overflow-hidden rounded-md bg-gray-100">
                  {round.book.thumbnailUrl ? (
                    <img
                      src={round.book.thumbnailUrl}
                      alt={`${round.book.title} 표지`}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 p-5">
          <h2 className="text-base font-semibold text-gray-900">참여 중인 멤버</h2>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {participantsPreview.profileImages.slice(0, 5).map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-gray-100"
                >
                  <img src={src} alt="참여자 프로필" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              지금까지 {participantsPreview.previewCount}명이 참여했어요
            </p>
          </div>
        </section>

        <section className="space-y-2 p-5">
          <h2 className="text-base font-semibold text-gray-900">사전 과제 안내</h2>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-600">
              모임 가입 후 토론 참여를 위해서 독후감을 제출해야 합니다.
            </p>
            <p className="flex items-center gap-2 text-body !font-[600] text-gray-800">
              <BookOpenIcon className="h-5 w-5 text-gray-700" aria-hidden="true" />
              독후감 최소 400자
            </p>
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 bg-white px-6 pb-6 pt-3 shadow-[0_-10px_24px_rgba(15,23,42,0.06)]">
        <button
          type="button"
          disabled={action.disabled || isJoining}
          onClick={handleJoin}
          className={`h-12 w-full rounded-2xl text-sm font-semibold text-white transition ${
            action.tone === "danger"
              ? "bg-red-500"
              : action.tone === "info"
                ? "bg-primary-purple"
                : action.tone === "muted"
                  ? "bg-gray-300 text-gray-700"
                  : "bg-gray-900"
          }`}
        >
          {isJoining ? "요청 중..." : action.label}
        </button>
      </div>

      <WarningConfirmModal
        isOpen={modalType === "login"}
        isClosing={isClosing}
        title="로그인이 필요해요"
        description="모임에 가입하려면 로그인해주세요."
        confirmLabel="로그인하기"
        cancelLabel="취소"
        onClose={closeModal}
        onConfirm={() => {
          closeModal();
          router.push("/oauth");
        }}
      />
      <WarningConfirmModal
        isOpen={modalType === "notFound"}
        isClosing={isClosing}
        title="존재하지 않는 모임입니다."
        description="삭제되었거나 접근할 수 없는 모임이에요."
        confirmLabel="확인"
        cancelLabel="닫기"
        onClose={closeModal}
        onConfirm={closeModal}
      />
      <WarningConfirmModal
        isOpen={modalType === "already"}
        isClosing={isClosing}
        title="이미 참여 요청이 접수된 모임입니다."
        description="승인 결과를 기다려주세요."
        confirmLabel="확인"
        cancelLabel="닫기"
        onClose={closeModal}
        onConfirm={closeModal}
      />
      <WarningConfirmModal
        isOpen={modalType === "blocked"}
        isClosing={isClosing}
        title="해당 모임에 참여할 수 없습니다."
        description="모임 참여가 제한된 상태입니다."
        confirmLabel="확인"
        cancelLabel="닫기"
        onClose={closeModal}
        onConfirm={closeModal}
      />
    </div>
  );
}
