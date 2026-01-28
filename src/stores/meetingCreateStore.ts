import { create } from "zustand";

export type MeetingRound = {
  roundNo: number;
  date: string;
};

export type MeetingBook = {
  isbn13: string;
  title: string;
  authors: string;
  publisher: string;
  thumbnailUrl: string;
  publishedAt: string;
};

export type MeetingCreateState = {
  meetingImageFile: File | null;
  meetingImagePath: string;
  title: string;
  readingGenreId: number | null;
  capacity: number;
  description: string;
  leaderIntro: string;
  leaderIntroSavePolicy: boolean;
  roundCount: number;
  rounds: MeetingRound[];
  time: { startTime: string; endTime: string };
  booksByRound: { roundNo: number; book: MeetingBook | null }[];
  durationMinutes: number;
  firstRoundAt: string;
  recruitmentDeadline: string;
  setField: <K extends keyof Omit<MeetingCreateState, "setField">>(
    key: K,
    value: MeetingCreateState[K],
  ) => void;
  setAll: (values: Partial<MeetingCreateState>) => void;
  setRoundDate: (roundNo: number, date: string) => void;
  setBookForRound: (roundNo: number, book: MeetingBook) => void;
  reset: () => void;
};

const initialState: Omit<
  MeetingCreateState,
  "setField" | "setAll" | "setRoundDate" | "setBookForRound" | "reset"
> = {
  meetingImageFile: null,
  meetingImagePath: "",
  title: "",
  readingGenreId: null,
  capacity: 4,
  description: "",
  leaderIntro: "",
  leaderIntroSavePolicy: false,
  roundCount: 2,
  rounds: [{ roundNo: 1, date: "" }],
  time: { startTime: "", endTime: "" },
  booksByRound: [{ roundNo: 1, book: null }],
  durationMinutes: 0,
  firstRoundAt: "",
  recruitmentDeadline: "",
};

export const useMeetingCreateStore = create<MeetingCreateState>((set) => ({
  ...initialState,
  setField: (key, value) => set({ [key]: value } as Partial<MeetingCreateState>),
  setAll: (values) => set(values),
  setRoundDate: (roundNo, date) =>
    set((state) => ({
      rounds: state.rounds.map((round) => (round.roundNo === roundNo ? { ...round, date } : round)),
    })),
  setBookForRound: (roundNo, book) =>
    set((state) => ({
      booksByRound: state.booksByRound.map((entry) =>
        entry.roundNo === roundNo ? { ...entry, book } : entry,
      ),
    })),
  reset: () => set(initialState),
}));
