import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { toFormData, portfolioUpdateFormDataOptions } from "../src/shared/formData.ts";
import { buildMemberPayload } from "../src/shared/adminFormValues.ts";
import { getPortfolioUploadError } from "../src/shared/portfolioUpload.ts";
import { parseErrorMessage } from "../src/shared/error.ts";

const mib = 1024 * 1024;
const file = (size = 1, type = "image/jpeg") => ({ name: "test.jpg", size, type });

test("100MB와 200MB 경계값까지 허용하고 초과는 차단한다", () => {
  assert.equal(getPortfolioUploadError([file(100 * mib)]), null);
  assert.match(getPortfolioUploadError([file(100 * mib + 1)]), /100MB/);
  assert.equal(getPortfolioUploadError([file(100 * mib), file(100 * mib)]), null);
  assert.match(getPortfolioUploadError([file(75 * mib), file(75 * mib), file(75 * mib)]), /200MB/);
});
test("새 사진 20장까지 허용하고 지원하지 않는 파일은 차단한다", () => {
  assert.equal(getPortfolioUploadError(Array.from({ length: 20 }, () => file())), null);
  assert.match(getPortfolioUploadError(Array.from({ length: 21 }, () => file())), /20장/);
  for (const type of ["image/jpeg", "image/png", "image/webp"]) {
    assert.equal(getPortfolioUploadError([file(1, type)]), null);
  }
  for (const type of ["image/gif", "image/heic", "", "text/plain"]) {
    assert.match(getPortfolioUploadError([file(1, type)]), /JPEG, PNG, WEBP/);
  }
  assert.equal(getPortfolioUploadError([]), null);
});
test("수정 시 빈 설명과 분류 해제를 multipart에 포함한다", () => {
  const form = toFormData({ description: "", category_id: null, year: "", location: "", area: "" }, portfolioUpdateFormDataOptions);
  assert.deepEqual(Object.fromEntries(form.entries()), { description: "", category_id: "", year: "", location: "", area: "" });
  assert.equal(toFormData({ description: "", category_id: null }).has("category_id"), false);
});
test("파일 순서와 false·0 등 기존 multipart 전송을 유지한다", () => {
  const first = new File(["first"], "first.jpg", { type: "image/jpeg" });
  const second = new File(["second"], "second.png", { type: "image/png" });
  const form = toFormData({ images: [first, second], is_featured: false, order: 0, omitted: undefined });
  assert.deepEqual(form.getAll("images").map((f) => f.name), ["first.jpg", "second.png"]);
  assert.equal(form.get("is_featured"), "false");
  assert.equal(form.get("order"), "0");
  assert.equal(form.has("omitted"), false);
});
test("팀원 자격·경력의 빈값을 전송하고 이전 학력 필드를 비운다", () => {
  const payload = buildMemberPayload({ role: "staff", name: " 이름 ", title: " ", career: " ", order: "0" });
  assert.deepEqual(payload, { role: "staff", name: "이름", title: "", education: "", career: "", order: 0 });
  assert.match(JSON.stringify(payload), /"career":""/);
});
test("배열·중첩 이미지 오류와 413의 실제 이유를 표시한다", () => {
  assert.equal(parseErrorMessage({ response: { status: 400, data: ["이미지 파일은 100MB 이하여야 합니다."] } }), "이미지 파일은 100MB 이하여야 합니다.");
  assert.equal(parseErrorMessage({ response: { status: 400, data: { images: [{ image: ["지원하지 않는 이미지"] }] } } }), "이미지: 지원하지 않는 이미지");
  assert.match(parseErrorMessage({ response: { status: 413, data: "<html>too large</html>" } }), /용량.*나눠/);
  assert.equal(parseErrorMessage({ response: { status: 400, data: null } }), "입력한 내용을 다시 확인해주세요.");
  assert.match(parseErrorMessage({ response: { status: 403 } }), /권한/);
});

function hookHarness(images = []) {
  const portfolio = { id: "1", title: "작품", parent_category_id: "", category_id: "", description: "", year: "", location: "", area: "", is_featured: false, order: "0", images, existingImages: [{ id: 10 }, { id: 11 }] };
  const initial = new Map([[6, "edit"], [7, portfolio]]);
  const states = new Map();
  const mutations = [];
  let index = 0;
  const react = {
    useMemo: (fn) => fn(),
    useState: (value) => {
      const key = index++;
      states.set(key, initial.has(key) ? initial.get(key) : typeof value === "function" ? value() : value);
      return [states.get(key), (next) => states.set(key, typeof next === "function" ? next(states.get(key)) : next)];
    },
  };
  const query = {
    useQueryClient: () => ({ invalidateQueries() {}, removeQueries() {} }),
    useQuery: () => ({ data: undefined, isSuccess: true, refetch() {} }),
    useMutation: (options) => ({ isPending: false, options, mutate: (payload) => mutations.push(payload) }),
  };
  const moduleMocks = {
    react,
    "@tanstack/react-query": query,
    "../../../api/sowaApi": { sowaApi: { admin: {} } },
    "../../../shared/error": { parseErrorMessage },
    "../../../shared/portfolioUpload": { getPortfolioUploadError },
    "../../../shared/adminFormValues": { buildMemberPayload },
  };
  const source = readFileSync(new URL("../src/components/admin/hooks/useAdminPageModel.ts", import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const context = { exports: {}, require: (name) => { assert.ok(moduleMocks[name], name); return moduleMocks[name]; } };
  runInNewContext(js, context);
  return { model: context.exports.useAdminPageModel(), states, mutations };
}
test("사진 삭제 실패 시 기존 사진을 유지하고 성공한 경우에만 제거한다", () => {
  const { model, states } = hookHarness();
  model.deletePortfolioImageMutation.mutate(10);
  assert.equal(states.get(7).existingImages.length, 2);
  model.deletePortfolioImageMutation.options.onError({ response: { status: 403 } });
  assert.equal(states.get(7).existingImages.length, 2);
  model.deletePortfolioImageMutation.options.onSuccess(undefined, 10);
  assert.equal(states.get(7).existingImages.length, 1);
  assert.equal(states.get(7).existingImages[0].id, 11);
});
test("초과 파일은 생성·수정 API 요청 전에 차단한다", () => {
  const { model, states, mutations } = hookHarness([file(101 * mib)]);
  model.submitPortfolioCreate({ preventDefault() {} });
  model.submitPortfolioUpdate();
  assert.equal(mutations.length, 0);
  assert.match(states.get(1).message, /100MB/);
});
