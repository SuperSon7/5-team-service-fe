"use client";

export default function KakaoLoginButton() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const loginUrl = `${base}/oauth/kakao`;

  return (
    <button
      type="button"
      onClick={() => {
        if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
        window.location.href = loginUrl;
      }}
      className="flex w-full items-center justify-center gap-2.5 rounded-[12px] bg-[#FEE500] px-6 py-3 text-base font-semibold text-black/85"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="text-black">
        <path
          fill="currentColor"
          d="M12 4c-4.4 0-8 2.8-8 6.3 0 2.2 1.4 4.2 3.6 5.4l-.9 3.2c-.1.4.3.7.7.5l3.7-2.1c.3 0 .6.1.9.1 4.4 0 8-2.8 8-6.3S16.4 4 12 4z"
        />
      </svg>
      카카오로 시작하기
    </button>
  );
}
