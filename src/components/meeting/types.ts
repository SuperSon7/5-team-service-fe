import { Book } from "../book/types";

export type MeetingItemData = {
  meetingId: number;
  meetingImagePath: string;
  title: string;
  readingGenreId: number;
  leaderNickname: string;
  capacity: number;
  currentMemberCount: number;
  remainingDays: number;
};

export type MeetingBasicInfo = {
  meetingImagePath: string;
  title: string;
  description: string;
  capacity: number;
  leaderIntro: string;
  durationMinutes: number;
  firstRoundAt: string;
  recruitmentDeadline: string;
};

export type RoundInfo = {
  roundNo: number;
  date: string;
};

export type MeetingRoundInfo = {
  roundCounts: number;
  rounds: RoundInfo[];
};

export type MeetingTimeInfo = {
  startTime: string;
  endTime: string;
};

export type RoundBookInfo = {
  roundNo: number;
  book: Book[];
};

export type MeetingBooksByRoundInfo = {
  booksByRound: RoundBookInfo[];
};

export type CreateMeetingData = MeetingBasicInfo &
  MeetingRoundInfo &
  MeetingTimeInfo &
  MeetingBooksByRoundInfo;

export type MeetingDetailResponse = {
  meeting: {
    meetingId: number;
    createdAt: string;
    status: "RECRUITING" | "CLOSED" | "FINISHED";
    meetingImagePath: string;
    title: string;
    description: string;
    readingGenreId: number;
    capacity: number;
    currentCount: number;
    recruitmentDeadline: string;
    roundCount: number;
    time: {
      startTime: string;
      endTime: string;
    };
    leader: {
      userId: number;
      nickname: string;
      profileImagePath: string;
      intro: string;
    };
  };
  rounds: {
    roundNo: number;
    date: string;
    book: {
      title: string;
      authors: string;
      publisher: string;
      thumbnailUrl: string;
      publishedAt: string;
    };
  }[];
  participantsPreview: {
    previewCount: number;
    profileImages: string[];
    myParticipationStatus: "NONE" | "PENDING" | "APPROVED";
  };
};
