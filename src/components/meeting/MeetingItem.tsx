import Link from "next/link";
import { MeetingItemData } from "./types";
import Image from "next/image";

export function MeetingItem({
  meeting,
  genreName,
  onClick,
}: {
  meeting: MeetingItemData;
  genreName?: string;
  onClick?: () => void;
}) {
  const {
    meetingId,
    meetingImagePath,
    title,
    leaderNickname,
    capacity,
    currentMemberCount,
    remainingDays,
  } = meeting;

  return (
    <Link
      href={`/meeting/detail/${meetingId}`}
      className="block rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
      aria-label={`${title} 모임 상세 보기`}
      onClick={onClick}
    >
      <div className="relative">
        <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-gray-200">
          <Image
            src={meetingImagePath}
            fill
            sizes="100vw"
            alt="모임 이미지"
            className="object-cover"
          />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-primary-purple px-2.5 py-1 text-xs font-medium text-white">
          {remainingDays < 0 ? `D+${-remainingDays}` : `D-${remainingDays}`}
        </span>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-body-1 !font-[600] text-gray-900">{title}</p>
        <span className="text-body-2 !font-[600] text-gray-900">| </span>
        <span className="text-body-2 text-gray-900">{genreName ?? "기타"}</span>
      </div>

      <div className="mt-3 space-y-1 text-body-2 text-gray-600">
        <p>
          모임장 <span className="!font-[600] !text-gray-900">{leaderNickname}</span>
        </p>
        <p>
          모집현황{" "}
          <span className="!font-[600] !text-gray-900">
            {currentMemberCount}/{capacity}명
          </span>
        </p>
      </div>
    </Link>
  );
}
