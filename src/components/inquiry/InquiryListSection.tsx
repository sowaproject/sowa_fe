import type { InquiryItem } from "./types";
import Button from "../ui/Button";
import StatusBadge from "../ui/StatusBadge";

interface InquiryListSectionProps {
  inquiries: InquiryItem[];
  onWrite: () => void;
}

export default function InquiryListSection({ inquiries, onWrite }: InquiryListSectionProps) {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm text-text-muted">총 {inquiries.length}개의 문의</p>
        <Button type="button" onClick={onWrite} className="h-11 px-7">
          글쓰기
        </Button>
      </div>

      <div className="space-y-3">
        {inquiries.map((item) => (
          <article key={item.id} className="rounded-xl border border-line bg-card px-5 py-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-lg font-semibold text-text-main">{item.title}</p>
              <StatusBadge tone={item.hasReply ? "success" : "warn"}>
                {item.hasReply ? "답변완료" : "대기중"}
              </StatusBadge>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted">
              <span>문의번호 #{item.id}</span>
              <span>작성자 {item.name}</span>
              <span>작성일 {item.createdAt}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
