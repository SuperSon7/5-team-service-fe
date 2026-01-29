export type MyMeetingItem = {
  meetingId: number;
  meetingImagePath: string;
  title: string;
  readingGenreId: number | string;
  leaderNickname: string;
  currentRound: number;
  meetingDate: string;
};

export type MyMeetingListResponse = {
  items: MyMeetingItem[];
  pageInfo: {
    nextCursorId: number | null;
    hasNext: boolean;
    size: number;
  };
};

export const STATUS_TABS = [
  { label: "진행중", value: "ACTIVE" },
  { label: "종료", value: "INACTIVE" },
] as const;

export type StatusValue = (typeof STATUS_TABS)[number]["value"];

export type MeetingRound = {
  roundId: number;
  roundNo: number;
  meetingDate: string;
  dday: number;
  meetingLink: string | null;
  canJoinMeeting: boolean;
  book: {
    title: string;
    authors: string;
    publisher: string;
    thumbnailUrl: string;
    publishedAt: string;
  };
  bookReport: {
    status: null | "SUBMITTED" | "APPROVED" | "REJECTED";
    id: number | null;
    writableUntil: string | null;
  };
  topics?: { topicNo: number; topic: string }[];
  myProgressPercent?: number;
  membersProgress?: { meetingMemberId: number; nickname: string; progressPercent: number }[];
  bestMeetingMember?: {
    nickname: string;
    tierImagePath: string;
    profileImagePath: string;
  };
  review?: { status: string; id: number | null; writableUntil: string | null };
};

export type MyMeetingDetailResponse = {
  meetingId: number;
  meetingImagePath: string;
  title: string;
  readingGenreName: string;
  leaderInfo: {
    profileImagePath: string;
    nickname: string;
  };
  myRole: "LEADER" | "MEMBER";
  roundCount: number;
  capacity: number;
  currentMemberCount: number;
  rounds: MeetingRound[];
  currentRoundNo: number;
};
