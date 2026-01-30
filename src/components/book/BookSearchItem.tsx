import Image from "next/image";
import { Book } from "./types";

export default function BookSearchItem({ book, onSelect }: { book: Book; onSelect?: () => void }) {
  const { title, authors, thumbnailUrl, publisher, publishedAt } = book;
  return (
    <button type="button" onClick={onSelect} className="flex w-full gap-4 my-3 text-left">
      <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-sm bg-gray-100">
        {thumbnailUrl ? (
          <Image className="object-cover" fill sizes="100vw" src={thumbnailUrl} alt={title} />
        ) : null}
      </div>
      <div className="flex min-h-[96px] flex-1 flex-col justify-between">
        <div>
          <div className="text-body-1 !font-[500]">{title}</div>
          <div className="text-body-2 text-gray-700">{authors}</div>
        </div>
        <div>
          <div className="text-label !font-[400] text-gray-400">{publisher}</div>
          <div className="text-label !font-[400] text-gray-400">{publishedAt}</div>
        </div>
      </div>
    </button>
  );
}
