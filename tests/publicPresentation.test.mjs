import assert from "node:assert/strict";
import test from "node:test";
import { parsePortfolioId, splitHeroTitle } from "../src/shared/publicPresentation.ts";

test("상세 주소는 양의 안전한 정수만 허용한다", () => {
  for (const id of [undefined, "", "abc", "0", "-1", "1.5", "Infinity", "1e2", " 6", "9007199254740992"]) {
    assert.equal(parsePortfolioId(id), null, String(id));
  }
  assert.equal(parsePortfolioId("6"), 6);
  assert.equal(parsePortfolioId("0007"), 7);
  assert.equal(parsePortfolioId("9007199254740991"), 9007199254740991);
});

test("지정 문구 앞에서만 줄을 나누고 관리자가 정한 제목을 보존한다", () => {
  assert.deepEqual(splitHeroTitle("당신의 일상이 온전히 채워지는 바탕"), ["당신의 일상이 온전히", "채워지는 바탕"]);
  assert.deepEqual(splitHeroTitle("다른 제목"), ["다른 제목"]);
  assert.deepEqual(splitHeroTitle("채워지는 바탕"), ["채워지는 바탕"]);
  assert.deepEqual(splitHeroTitle("일상이 채워지는 바탕, SOWA"), ["일상이", "채워지는 바탕, SOWA"]);
});
