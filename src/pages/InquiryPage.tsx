import { useState, type FormEvent } from "react";

interface InquiryFormValues {
  name: string;
  phone: string;
  password: string;
  age: "" | "20" | "30" | "40";
  interiorType: "" | "residential" | "commercial";
  area: string;
  moveInDate: string;
  workRequest: string;
  content: string;
}

interface InquiryItem {
  id: number;
  title: string;
  name: string;
  createdAt: string;
  hasReply: boolean;
}

const initialForm: InquiryFormValues = {
  name: "",
  phone: "",
  password: "",
  age: "",
  interiorType: "",
  area: "",
  moveInDate: "",
  workRequest: "",
  content: "",
};

const initialInquiries: InquiryItem[] = [
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

export default function InquiryPage() {
  const [isWriting, setIsWriting] = useState(false);
  const [form, setForm] = useState<InquiryFormValues>(initialForm);
  const [inquiries, setInquiries] = useState<InquiryItem[]>(initialInquiries);

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
    <div className="bg-[#ececec]">
      <section className="border-y border-slate-200 px-6 py-16 text-center md:py-20">
        <h1 className="text-[56px] font-medium tracking-[-0.01em] text-[#2f4359] md:text-[62px]">문의하기</h1>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-6 py-14 md:py-16">
        {!isWriting ? (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm text-slate-600">총 {inquiries.length}개의 문의</p>
              <button
                type="button"
                onClick={() => setIsWriting(true)}
                className="inline-flex h-11 items-center rounded-md bg-[#c7a767] px-7 text-sm font-semibold text-white transition hover:brightness-95"
              >
                글쓰기
              </button>
            </div>

            <div className="space-y-3">
              {inquiries.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-lg font-semibold text-[#2f4359]">{item.title}</p>
                    <span
                      className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${
                        item.hasReply
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.hasReply ? "답변완료" : "대기중"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span>문의번호 #{item.id}</span>
                    <span>작성자 {item.name}</span>
                    <span>작성일 {item.createdAt}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-[980px] rounded-2xl border border-slate-200 bg-[#f3f3f1] p-6 shadow-sm md:p-8">
            <form className="space-y-4" onSubmit={onSubmit}>
              <FieldLabel label="이름" required />
              <TextInput
                value={form.name}
                onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
                placeholder="이름을 입력해주세요"
                required
              />

              <FieldLabel label="연락처" required />
              <TextInput
                value={form.phone}
                onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
                placeholder="연락처를 입력해주세요"
                required
              />

              <FieldLabel label="비밀번호" required />
              <TextInput
                value={form.password}
                onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
                placeholder="글 조회 시 필요한 비밀번호"
                type="password"
                required
              />
              <p className="-mt-3 text-sm text-slate-500">문의 내용 확인 시 필요합니다</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel label="연령대" />
                  <div className="mt-2 flex flex-wrap gap-5 text-base text-[#2f4359]">
                    <Radio checked={form.age === "20"} label="20대" name="age" onChange={() => setForm((prev) => ({ ...prev, age: "20" }))} />
                    <Radio checked={form.age === "30"} label="30대" name="age" onChange={() => setForm((prev) => ({ ...prev, age: "30" }))} />
                    <Radio checked={form.age === "40"} label="40대" name="age" onChange={() => setForm((prev) => ({ ...prev, age: "40" }))} />
                  </div>
                </div>

                <div>
                  <FieldLabel label="인테리어 종류" />
                  <div className="mt-2 flex flex-wrap gap-5 text-base text-[#2f4359]">
                    <Radio checked={form.interiorType === "residential"} label="주거" name="interiorType" onChange={() => setForm((prev) => ({ ...prev, interiorType: "residential" }))} />
                    <Radio checked={form.interiorType === "commercial"} label="상업" name="interiorType" onChange={() => setForm((prev) => ({ ...prev, interiorType: "commercial" }))} />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel label="평수" />
                  <TextInput value={form.area} onChange={(value) => setForm((prev) => ({ ...prev, area: value }))} placeholder="예: 32평" />
                </div>
                <div>
                  <FieldLabel label="입주 예상 날짜" />
                  <TextInput value={form.moveInDate} onChange={(value) => setForm((prev) => ({ ...prev, moveInDate: value }))} placeholder="예: 2025년 3월" />
                </div>
              </div>

              <FieldLabel label="원하는 공사" />
              <TextArea value={form.workRequest} onChange={(value) => setForm((prev) => ({ ...prev, workRequest: value }))} placeholder="원하시는 공사 내용을 입력해주세요" />

              <FieldLabel label="기타 요구사항" />
              <TextArea value={form.content} onChange={(value) => setForm((prev) => ({ ...prev, content: value }))} placeholder="기타 요구사항을 입력해주세요" />

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWriting(false)}
                  className="inline-flex h-12 min-w-28 items-center justify-center border border-slate-400 px-5 text-sm font-medium text-slate-700"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="inline-flex h-12 min-w-36 items-center justify-center bg-[#c7a767] px-7 text-sm font-semibold text-white"
                >
                  문의 등록
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}

function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <label className="block text-[18px] font-semibold text-[#2f4359]">
      {label} {required ? <span className="text-red-500">*</span> : null}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  type?: "text" | "password";
}) {
  return (
    <input
      type={type}
      required={required}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-700 placeholder:text-slate-500"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="min-h-24 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-500"
    />
  );
}

function Radio({
  checked,
  label,
  name,
  onChange,
}: {
  checked: boolean;
  label: string;
  name: string;
  onChange: () => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-[16px] font-medium">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="h-4 w-4" />
      <span>{label}</span>
    </label>
  );
}
