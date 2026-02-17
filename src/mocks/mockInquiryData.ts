import type { InquiryItem } from "../components/inquiry/types";

export const initialInquiries: InquiryItem[] = [
  {
    id: 1042,
    title: "강남 아파트 리모델링 문의",
    name: "김민지",
    createdAt: "2026.02.12",
    hasReply: true,
  },
  {
    id: 1041,
    title: "카페 인테리어 견적 요청",
    name: "박성훈",
    createdAt: "2026.02.10",
    hasReply: false,
  },
  {
    id: 1040,
    title: "오피스 리뉴얼 일정 상담",
    name: "이유진",
    createdAt: "2026.02.08",
    hasReply: false,
  },
];
