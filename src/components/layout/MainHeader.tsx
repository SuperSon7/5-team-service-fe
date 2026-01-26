"use client";

import Link from "next/link";
import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function MainHeader({
  hasUnread = false,
}: { hasUnread: boolean }) {
  return (
    <header className="flex items-center justify-between px-6 py-5">
      <Link href="/" className="text-lg font-bold text-gray-900" aria-label="홈으로">
        DOKTORI
      </Link>
      <div className="flex items-center gap-1">
        <Link
          href="/meeting/search"
          className="relative flex h-9 w-9 items-center justify-center text-gray-800"
          aria-label="모임 검색"
        >
          <MagnifyingGlassIcon className="h-6 w-6 stroke-[2]" aria-hidden="true" />
        </Link>
        <Link
          href="/alarm"
          className="relative flex h-9 w-9 items-center justify-center text-gray-800"
          aria-label="알림"
        >
          <BellIcon className="h-6 w-6 stroke-[2]" aria-hidden="true" />
          {hasUnread ? (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary-orange" />
          ) : null}
        </Link>
      </div>
    </header>
  );
}
