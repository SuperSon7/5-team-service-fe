import PageHeader from "@/components/layout/PageHeader";
import MeetingCreateStep2 from "@/components/meeting/MeetingCreateStep2";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="relative flex h-dvh flex-col bg-white">
      <PageHeader title="독서 모임 생성" />
      <div className="flex min-h-0 flex-1 flex-col px-6 pb-8 pt-6 overflow-y-auto">
        <Suspense fallback={null}>
          <MeetingCreateStep2 />
        </Suspense>
      </div>
    </div>
  );
}
