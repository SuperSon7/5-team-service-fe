"use client";

import Link from "next/link";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  UserCircleIcon,
  BookmarkIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useSearchParams } from "next/navigation";

const navItems = [
  { label: "관심 모임", href: "/coming-soon?tab=interest", Icon: BookmarkIcon },
  { label: "나의 모임", href: "/coming-soon?tab=my-club", Icon: BookOpenIcon },
  { label: "홈", href: "/", Icon: HomeIcon },
  { label: "채팅 토론", href: "/coming-soon?tab=chat", Icon: ChatBubbleLeftEllipsisIcon },
  { label: "마이페이지", href: "/coming-soon?tab=my-page", Icon: UserCircleIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  return (
    <nav className="h-16 border-t border-gray-200 bg-white">
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
              className={`flex flex-col items-center justify-center gap-1 px-2 py-3 text-xs font-medium ${
                isActive ? "text-gray-900" : "text-gray-400"
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
