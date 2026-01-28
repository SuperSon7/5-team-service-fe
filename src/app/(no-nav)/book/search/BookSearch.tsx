"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SearchBar, { Book } from "@/components/book/searchBar";
import PageHeader from "@/components/layout/PageHeader";

export default function BookSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/meeting/create/book";
  const roundParam = searchParams.get("round");
  const roundNo = roundParam ? Number(roundParam) : null;

  const handleSelect = (book: Book) => {
    if (roundNo && !Number.isNaN(roundNo)) {
      const key = `meetingCreate:selectedBook:${roundNo}`;
      sessionStorage.setItem(key, JSON.stringify(book));
      router.push(`${returnTo}?round=${roundNo}`);
      return;
    }
    router.push(returnTo);
  };

  return (
    <div className="relative flex h-dvh flex-col bg-white">
      <PageHeader title="도서 검색" />
      <div className="flex min-h-0 flex-1 flex-col px-6 pb-8 pt-6">
        <SearchBar onSelect={handleSelect} />
      </div>
    </div>
  );
}
