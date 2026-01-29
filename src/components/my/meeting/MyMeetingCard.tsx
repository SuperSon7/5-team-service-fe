"use client";

import formatKoreanDate from "@/lib/formatKoreanDate";
import Link from "next/link";

type MyMeetingCardProps = {
  meetingId: number;
  meetingImagePath: string;
  title: string;
  genreName?: string;
  leaderNickname: string;
  currentRound: number;
  meetingDate: string;
};

export default function MyMeetingCard({
  meetingId,
  meetingImagePath,
  title,
  genreName,
  leaderNickname,
  currentRound,
  meetingDate,
}: MyMeetingCardProps) {
  return (
    <Link
      href={`/my-meeting/${meetingId}`}
      className="block overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-gray-100">
        {meetingImagePath ? (
          <img src={meetingImagePath} alt={title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-body-1 !font-[600] text-gray-900">{title}</p>
        <span className="text-body-2 !font-[600] text-gray-900">| </span>
        <span className="text-body-2 text-gray-900">{genreName ?? "기타"}</span>
      </div>
      <div className="mt-3 space-y-1 text-body-2 text-gray-600">
        <p>
          모임장 <span className="!font-[600] text-gray-900">{leaderNickname}</span>
        </p>
        <p>
          회차 <span className="!font-[600] text-gray-900">{currentRound}회차</span>
        </p>
        <p>
          모임일 <span className="!font-[600] text-gray-900">{formatKoreanDate(meetingDate)}</span>
        </p>
      </div>
    </Link>
  );
}
