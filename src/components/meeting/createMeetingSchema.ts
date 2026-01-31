import { z } from "zod";

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;
const ALLOWED_CHARS = /^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9 ?!,.\(\)\[\]&+\-]+$/;
const MAX_FILE_SIZE = 5 * 1024 * 1024; //5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

const contentSchema = z
  .string()
  .min(2, { message: "최소 2자 이상 입력해야 합니다." })
  .max(300, { message: "최대 300자까지 입력 가능합니다." })
  .refine((v) => v.trim().length >= 2, { message: "공백만 입력할 수 없습니다." })
  .refine((v) => !CONTROL_CHARS.test(v), { message: "이모지나 특수문자는 사용할 수 없습니다." })
  .refine((v) => ALLOWED_CHARS.test(v), { message: "이모지나 특수문자는 사용할 수 없습니다." });

const timeString = z
  .string()
  .min(1, { message: "시간을 입력해주세요." })
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "시간 형식은 HH:MM 이어야 합니다.");
const dateString = z
  .string()
  .min(1, { message: "날짜를 입력해주세요." })
  .regex(/^\d{4}-\d{2}-\d{2}$/, "날짜는 YYYY-MM-DD 형식이어야 합니다.");

const ImageSchema = z
  .instanceof(File)
  .optional()
  .refine((file) => file !== undefined, {
    message: "이미지를 업로드 해주세요.",
  })
  .refine((file) => !file || ALLOWED_MIME_TYPES.includes(file.type), {
    message: "이미지는 JPG/JPEG 또는 PNG 파일만 업로드할 수 있습니다.",
  })
  .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
    message: "이미지는 최대 5MB까지 업로드할 수 있습니다.",
  });

const timeRangeSchema = z
  .object({
    startTime: timeString,
    endTime: timeString,
  })
  .strict();

const roundSchema = z
  .object({
    roundNo: z
      .number()
      .int()
      .positive()
      .min(1, { message: "최소 1회 이상이어야 합니다." })
      .max(8, { message: "최대 8회 이하여야 합니다." }),
    date: dateString,
  })
  .strict();

const bookSchema = z
  .object({
    isbn13: z.string().regex(/^\d{13}$/, "isbn13은 13자리 숫자여야 합니다."),
    title: z.string().min(1, { message: "책 제목이 정상적으로 입력되지 않았습니다." }),
    authors: z.string().min(1, { message: "작가명이 정상적으로 입력되지 않았습니다." }),
    publisher: z.string().min(1, { message: "출판사명이 정상적으로 입력되지 않았습니다." }),
    thumbnailUrl: z.string(),
    publishedAt: dateString,
  })
  .strict();

const bookByRoundSchema = z
  .object({
    roundNo: z
      .number()
      .int()
      .positive()
      .min(1, { message: "모임 횟수는 최소 1회 이상이어야 합니다." })
      .max(8, { message: "모임 횟수는 최대 8회 이하여야 합니다." }),
    book: bookSchema.nullable(),
  })
  .strict();

export const CreateMeetingBaseSchema = z.object({
  meetingImageFile: ImageSchema,
  meetingImagePath: z.string(),
  title: z
    .string()
    .min(2, { message: "모임명은 최소 2자 이상이여야 합니다." })
    .max(50, { message: "모임명은 최대 50자 이하여야 합니다." }),
  description: contentSchema,
  readingGenreId: z
    .number()
    .int()
    .min(1, { message: "정상 독서 장르 ID의 범위를 벗어났습니다." })
    .max(8, { message: "정상 독서 장르 ID의 범위를 벗어났습니다." }),
  capacity: z
    .number()
    .int()
    .min(3, { message: "모집 인원은 최소 3명 이상이여야 합니다." })
    .max(8, { message: "모집 인원은 최대 8명 이하여야 합니다." }),
  roundCount: z
    .number()
    .int()
    .positive()
    .min(1, { message: "모임 횟수는 최소 1회 이상이어야 합니다." })
    .max(8, { message: "모임 횟수는 최대 8회 이하여야 합니다." }),
  rounds: z.array(roundSchema).min(1),
  time: timeRangeSchema,
  booksByRound: z.array(bookByRoundSchema).min(1),
  leaderIntro: contentSchema,
  leaderIntroSavePolicy: z.boolean(),
  durationMinutes: z.number(),
  firstRoundAt: dateString,
  recruitmentDeadline: dateString,
});

export const CreateMeetingSchema = CreateMeetingBaseSchema.superRefine((data, ctx) => {
  if (data.roundCount !== data.rounds.length) {
    ctx.addIssue({
      code: "custom",
      path: ["rounds"],
      message: "roundCount와 rounds의 길이가 일치해야 합니다.",
    });
  }
  if (data.booksByRound.some((item) => !item.book)) {
    ctx.addIssue({
      code: "custom",
      path: ["booksByRound"],
      message: "모든 회차에 도서를 선택해주세요.",
    });
  }
});

export const BasicSchema = CreateMeetingBaseSchema.pick({
  meetingImageFile: true,
  meetingImagePath: true,
  title: true,
  description: true,
  readingGenreId: true,
  capacity: true,
  leaderIntro: true,
  leaderIntroSavePolicy: true,
});

export type CreateMeetingFormValues = z.infer<typeof CreateMeetingSchema>;

export const createMeetingDefaultValues: CreateMeetingFormValues = {
  meetingImageFile: undefined,
  meetingImagePath: "",
  title: "",
  description: "",
  readingGenreId: 1,
  capacity: 4,
  roundCount: 2,
  rounds: [{ roundNo: 1, date: "" }],
  time: { startTime: "", endTime: "" },
  booksByRound: [{ roundNo: 1, book: null }],
  leaderIntro: "",
  leaderIntroSavePolicy: false,
  durationMinutes: 0,
  firstRoundAt: "",
  recruitmentDeadline: "",
};
