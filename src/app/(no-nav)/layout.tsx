import MeetingCreateFormProvider from "@/components/meeting/MeetingCreateFormProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MeetingCreateFormProvider>{children}</MeetingCreateFormProvider>;
}
