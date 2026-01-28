"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@/components/ui/spinner";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/apiFetch";
import BookSearchItem from "./BookSearchItem";

export type Book = {
  title: string;
  authors: string;
  publisher: string;
  thumbnailUrl: string;
  publishedAt: string;
  isbn13: string;
};

type PageInfo = {
  page: number;
  size: number;
  totalCount: number;
  isEnd: boolean;
};

type BooksResponse = {
  data: Book[];
  pageInfo: PageInfo;
};

type BuildBooksUrlParams = {
  query: string;
  page: number;
  size: number;
};

function buildBooksUrl({ query, page, size }: BuildBooksUrlParams) {
  const params = new URLSearchParams();
  params.set("query", query);
  params.set("page", String(page));
  params.set("size", String(size));
  return `/books?${params.toString()}`;
}

export default function SearchBar({ onSelect }: { onSelect?: (book: Book) => void }) {
  const [keyword, setKeyword] = useState<string>("");
  const [submitted, setSubmitted] = useState<string>("");

  const listRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["books", submitted],
      queryFn: async ({ pageParam = 1 }) => {
        const url = buildBooksUrl({ query: submitted, page: pageParam, size: 10 });
        return await apiFetch<BooksResponse>(url, {});
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.pageInfo.isEnd ? undefined : allPages.length + 1,
      enabled: submitted.trim().length > 0,
    });

  const books = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data?.pages]);

  useEffect(() => {
    const root = listRef.current;
    const target = sentinelRef.current;
    if (!root || !target) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { root, rootMargin: "120px", threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, submitted]);

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4">
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setSubmitted(keyword.trim());
        }}
        className="flex"
      >
        <div className="flex w-full items-center gap-3 rounded-full bg-gray-100 px-4 py-3 text-gray-500">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          <input
            value={keyword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
            placeholder="도서명으로 검색하기"
          />
        </div>
      </form>

      <div ref={listRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner className="size-8 text-gray-500" />
          </div>
        ) : null}

        {isError ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
            도서를 찾을 수 없어요.
          </div>
        ) : null}

        <div className="flex flex-col gap-4 space-y-2 pb-6">
          {books.map((book) => (
            <BookSearchItem
              key={book.isbn13}
              book={book}
              onSelect={onSelect ? () => onSelect(book) : undefined}
            />
          ))}
        </div>
        {isFetchingNextPage ? (
          <div className="flex items-center justify-center pb-6">
            <Spinner className="size-5 text-gray-400" />
          </div>
        ) : null}
        {hasNextPage ? <div ref={sentinelRef} className="h-2" /> : null}
      </div>
    </div>
  );
}
