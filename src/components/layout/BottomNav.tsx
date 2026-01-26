"use client";

import Link from "next/link";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  UserCircleIcon,
  BookmarkIcon,
  BookOpenIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useSearchParams } from "next/navigation";

const navItems = [
  { label: "관심 모임", href: "/coming-soon?tab=interest", Icon: BookmarkIcon },
  { label: "나의 모임", href: "/coming-soon?tab=my-club", Icon: BookOpenIcon },
  { label: "홈", href: "/", Icon: HomeIcon },
  { label: "채팅 토론", href: "/coming-soon?tab=chat", Icon: ChatBubbleLeftEllipsisIcon },
  { label: "마이페이지", href: "/my", Icon: UserCircleIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  return (
    <nav className="relative h-16 border-t border-gray-200 bg-white">
      {pathname === "/" ? (
        <Link
          href="/meeting/create/1"
          aria-label="독서 모임 생성"
          className="absolute -top-20 right-7 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-primary-purple-1)] to-[var(--color-primary-purple)] text-white shadow-[0_12px_24px_rgba(91,93,235,0.35)]"
        >
          <PlusIcon className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
        </Link>
      ) : null}
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : item.href.startsWith("/coming-soon")
                ? pathname === "/coming-soon" && item.href.includes(`tab=${tab ?? ""}`)
                : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-3 text-xs font-semibold ${
                isActive ? "text-primary-purple" : "text-gray-400"
              }`}
            >
              <item.Icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
