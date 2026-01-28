import MainHeader from "@/components/layout/MainHeader";
import MeetingList from "@/components/meeting/MeetingList";
import RecommendedMeetings from "@/components/meeting/RecommendedMeetings";

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-20 bg-white">
        <MainHeader hasUnread />
      </div>
      <div className="flex-1">
        <RecommendedMeetings />
        <MeetingList />
      </div>
    </div>
  );
}
