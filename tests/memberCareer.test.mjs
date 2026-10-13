import assert from "node:assert/strict";
import test from "node:test";
import { getMemberCareer } from "../src/shared/memberCareer.ts";
import { buildMemberPayload } from "../src/shared/adminFormValues.ts";

test("기존 학력과 경력의 본문·줄바꿈을 하나의 경력으로 보존한다", () => {
  assert.equal(getMemberCareer({ education: "학교\n전공", career: "회사 A\n회사 B" }), "학교\n전공\n\n회사 A\n회사 B");
});

test("동일한 학력과 경력은 중복 표시하지 않는다", () => {
  assert.equal(getMemberCareer({ education: " 대학교 ", career: "대학교" }), "대학교");
});

test("한 필드만 있거나 둘 다 비어 있는 기존 데이터도 처리한다", () => {
  assert.equal(getMemberCareer({ education: "학교" }), "학교");
  assert.equal(getMemberCareer({ career: "회사" }), "회사");
  assert.equal(getMemberCareer({ education: null, career: null }), "");
});

test("통합 내용 저장 후 다시 편집해도 내용이 중복되거나 사라지지 않는다", () => {
  const career = getMemberCareer({ education: "학교", career: "회사" });
  const saved = buildMemberPayload({ role: "director", name: "이름", title: "", career, order: "1" });
  assert.equal(saved.education, "");
  assert.equal(saved.career, "학교\n\n회사");
  assert.equal(getMemberCareer(saved), career);
});

test("통합 경력을 지우면 이전 학력 내용도 되살아나지 않는다", () => {
  const saved = buildMemberPayload({ role: "director", name: "이름", title: "", career: "", order: "1" });
  assert.equal(saved.education, "");
  assert.equal(saved.career, "");
  assert.equal(getMemberCareer(saved), "");
});
