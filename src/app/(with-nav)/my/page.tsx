import Profile from "@/app/(with-nav)/my/Profile";
import MainHeader from "@/components/layout/MainHeader";

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <MainHeader hasUnread />
      <Profile />
    </div>
  );
}
