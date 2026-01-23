import KakaoLoginButton from "@/components/login/KakaoLoginButton";

export default function Page() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="relative z-10 max-w-xs">
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center justify-center gap-5">
            <h1 className="mt-4 text-title-1 !text-[40px] text-gray-900">책으로</h1>
            <img src="/book.png" alt="book" className="mx-auto w-18" />
          </div>
          <div className="flex flex-row items-center justify-center gap-5">
            <img src="/chat.png" alt="chat" className="mx-auto mt-6 w-20" />
            <h1 className="mt-4 text-title-1 !text-[40px] text-gray-900">모이는</h1>
          </div>
          <div className="flex flex-row items-center justify-center gap-5">
            <h1 className="mt-4 text-title-1 !text-[40px]  text-gray-900">마을</h1>
            <img src="/home.png" alt="home" className="mx-auto mt-6 w-24" />
          </div>
        </div>

        <p className="mt-15 text-subheading !text-[18px] !font-[400] text-gray-900">
          <span className="!font-[600]">독토리</span>에서 시간과 거리 상관없이
          <br />
          오늘의 책 이야기를 시작해요!
        </p>
      </div>

      <div className="relative z-10 mt-30 w-full max-w-sm">
        <KakaoLoginButton />
      </div>
    </div>
  );
}
