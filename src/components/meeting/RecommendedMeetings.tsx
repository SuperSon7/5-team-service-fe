"use client";

export default function RecommendedMeetings() {
  return (
    <div>
      <div className="px-6 my-3 flex flex-col gap-1">
        <p className="text-subheading">독토리 PICK</p>
        <p className="text-label !font-[400] text-gray-400">
          매주 월요일마다 업데이트 되는 이 주의 추천 모임을 만나보세요!
        </p>
      </div>
      <div className="my-5">
        <div className="w-full h-45 bg-gray-300 "></div>
      </div>
    </div>
  );
}
