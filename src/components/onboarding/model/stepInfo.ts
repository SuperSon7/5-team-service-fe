export type PolicyOption = {
  id: number;
  code: string;
  name: string;
};

export type StepInfo = {
  step: number;
  type: "선호도" | "습관" | "목적";
  description: string;
  subdescription: string;
  endpoint: string;
  maxSelect?: number;
};

export const stepInfo: StepInfo[] = [
  {
    step: 1,
    type: "선호도",
    description: "어떤 장르의 책을 좋아하시나요?",
    subdescription: "자주 읽거나, 앞으로 더 읽고 싶은 장르를 골라주세요.",
    endpoint: "/policies/reading-genres",
    maxSelect: 3,
  },
  {
    step: 2,
    type: "습관",
    description: "한 달 평균 독서량은 몇 권 인가요?",
    subdescription: "독서 페이스를 알기 위한 질문이에요. 부담 없이 골라주세요.",
    endpoint: "/policies/reading-volumes",
  },
  {
    step: 3,
    type: "목적",
    description: "독서 모임에 참여하시는 목적이 무엇인가요?",
    subdescription: "독토리에서 가장 기대하는 경험을 선택해주세요.",
    endpoint: "/policies/reading-purposes",
    maxSelect: 2,
  },
];
