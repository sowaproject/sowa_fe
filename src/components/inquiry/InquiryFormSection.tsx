import type { FormEvent } from "react";
import Button from "../ui/Button";
import FieldLabel from "../ui/FieldLabel";
import RadioOption from "../ui/RadioOption";
import TextArea from "../ui/TextArea";
import TextInput from "../ui/TextInput";
import type { InquiryFormValues } from "./types";

interface InquiryFormSectionProps {
  form: InquiryFormValues;
  onChange: <K extends keyof InquiryFormValues>(
    key: K,
    value: InquiryFormValues[K],
  ) => void;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function InquiryFormSection({
  form,
  onChange,
  onCancel,
  onSubmit,
}: InquiryFormSectionProps) {
  return (
    <div className="mx-auto max-w-280 rounded-2xl border border-line bg-card p-5 shadow-sm md:p-6">
      <form className="grid gap-4 lg:grid-cols-2" onSubmit={onSubmit}>
        <div className="space-y-1">
          <FieldLabel label="이름" required />
          <TextInput
            value={form.name}
            onValueChange={(value) => onChange("name", value)}
            placeholder="이름을 입력해주세요"
            required
          />

          <FieldLabel label="연락처" required />
          <TextInput
            value={form.phone}
            onValueChange={(value) => onChange("phone", value)}
            placeholder="연락처를 입력해주세요"
            required
          />

          <FieldLabel label="비밀번호" required />
          <TextInput
            value={form.password}
            onValueChange={(value) => onChange("password", value)}
            placeholder="글 조회 시 필요한 비밀번호"
            type="password"
            required
          />
          <p className=" text-xs text-text-muted">
            문의 내용 확인 시 필요합니다
          </p>

          <FieldLabel label="연령대" />
          <div className="flex flex-wrap gap-5 text-sm text-text-main">
            <RadioOption
              checked={form.age === "20"}
              label="20대"
              name="age"
              onChange={() => onChange("age", "20")}
            />
            <RadioOption
              checked={form.age === "30"}
              label="30대"
              name="age"
              onChange={() => onChange("age", "30")}
            />
            <RadioOption
              checked={form.age === "40"}
              label="40대"
              name="age"
              onChange={() => onChange("age", "40")}
            />
          </div>

          <FieldLabel label="인테리어 종류" />
          <div className="flex flex-wrap gap-5 text-sm text-text-main">
            <RadioOption
              checked={form.interiorType === "residential"}
              label="주거"
              name="interiorType"
              onChange={() => onChange("interiorType", "residential")}
            />
            <RadioOption
              checked={form.interiorType === "commercial"}
              label="상업"
              name="interiorType"
              onChange={() => onChange("interiorType", "commercial")}
            />
          </div>
        </div>

        <div className="space-y-1">
          <FieldLabel label="평수" />
          <TextInput
            value={form.area}
            onValueChange={(value) => onChange("area", value)}
            placeholder="예: 32평"
          />

          <FieldLabel label="입주 예상 날짜" />
          <TextInput
            value={form.moveInDate}
            onValueChange={(value) => onChange("moveInDate", value)}
            placeholder="예: 2025년 3월"
          />

          <FieldLabel label="원하는 공사" />
          <TextArea
            value={form.workRequest}
            onValueChange={(value) => onChange("workRequest", value)}
            placeholder="원하시는 공사 내용을 입력해주세요"
          />

          <FieldLabel label="기타 요구사항" />
          <TextArea
            value={form.content}
            onValueChange={(value) => onChange("content", value)}
            placeholder="기타 요구사항을 입력해주세요"
          />
        </div>

        <div className="flex justify-center gap-3 pt-1 lg:col-span-2">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="h-11 min-w-28 border-line-strong px-5 hover:bg-card-soft"
          >
            취소
          </Button>
          <Button
            type="submit"
            className="h-11 min-w-36 px-7"
          >
            문의 등록
          </Button>
        </div>
      </form>
    </div>
  );
}
