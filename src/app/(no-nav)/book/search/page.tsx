import { Suspense } from "react";
import BookSearch from "./BookSearch";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BookSearch />
    </Suspense>
  );
}
