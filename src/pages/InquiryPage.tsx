import { useState, type FormEvent } from "react";
import InquiryFormSection from "../components/inquiry/InquiryFormSection";
import InquiryListSection from "../components/inquiry/InquiryListSection";
import { initialInquiries } from "../mocks/mockInquiryData";
import {
  initialForm,
  type InquiryFormValues,
  type InquiryItem,
} from "../components/inquiry/types";

export default function InquiryPage() {
  const [isWriting, setIsWriting] = useState(false);
  const [form, setForm] = useState<InquiryFormValues>(initialForm);
  const [inquiries, setInquiries] = useState<InquiryItem[]>(initialInquiries);

  const updateForm = <K extends keyof InquiryFormValues>(
    key: K,
    value: InquiryFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextItem: InquiryItem = {
      id: Date.now(),
      title: form.workRequest || "새 문의",
      name: form.name,
      createdAt: new Date().toLocaleDateString("ko-KR"),
      hasReply: false,
    };

    setInquiries((prev) => [nextItem, ...prev]);
    setForm(initialForm);
    setIsWriting(false);
  };

  return (
    <div className="bg-surface-muted">
      {!isWriting ? (
        <section className="border-y border-line px-6 py-10 text-center">
          <h1 className="text-2xl font-medium tracking-[-0.01em] text-text-main md:text-4xl">
            문의하기
          </h1>
        </section>
      ) : null}

      <section
        className={`mx-auto w-full max-w-310 px-6 ${
          isWriting ? "py-6 md:py-7" : "py-10 md:py-12"
        }`}
      >
        {isWriting ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="inline-flex items-center px-1 text-sm font-medium text-text-main transition hover:text-text-muted"
            >
              ← 뒤로가기
            </button>
            <InquiryFormSection
              form={form}
              onChange={updateForm}
              onCancel={() => setIsWriting(false)}
              onSubmit={onSubmit}
            />
          </div>
        ) : (
          <InquiryListSection
            inquiries={inquiries}
            onWrite={() => setIsWriting(true)}
          />
        )}
      </section>
    </div>
  );
}
