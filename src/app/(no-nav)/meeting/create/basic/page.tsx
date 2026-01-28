import PageHeader from "@/components/layout/PageHeader";
import MeetingCreateStep1 from "@/components/meeting/MeetingCreateStep1";

export default function Page() {
  return (
    <div className="relative flex h-dvh flex-col bg-white">
      <div className="sticky top-0 z-10 shrink-0 bg-white">
        <PageHeader title="독서 모임 생성" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-6 pb-8 pt-6 overflow-y-auto">
        <MeetingCreateStep1 />
      </div>
    </div>
  );
}
