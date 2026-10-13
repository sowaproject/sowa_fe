import assert from "node:assert/strict";
import test from "node:test";
import { getPublicStory, getStoryExcerpt, getStoryOpeningSentences, getStoryParagraphs } from "../src/shared/storyText.ts";

test("카드 도입은 첫 두 문장이고 나머지 원문은 변경하지 않는다", () => {
  const text = "공릉동 골목의 작은 공간입니다. 함께 땀 흘리며 만들었습니다. 이곳에서 시작될 이야기를 응원합니다.";
  assert.equal(getStoryExcerpt(text), "공릉동 골목의 작은 공간입니다. 함께 땀 흘리며 만들었습니다.");
  assert.equal(getStoryParagraphs(text).join(" "), text);
  assert.equal(getStoryExcerpt(undefined), "");
  assert.equal(getStoryExcerpt(" \n "), "");
  assert.equal(getStoryExcerpt("설명란입니다."), "");
});

test("작성자가 입력한 문단과 줄바꿈을 우선 보존한다", () => {
  const text = "첫 번째 이야기입니다. 이어지는 문장입니다. 세 번째 문장입니다.\r\n\r\n두 번째 문단입니다.\r\n마지막 문단입니다.";
  assert.deepEqual(getStoryParagraphs(text), ["첫 번째 이야기입니다. 이어지는 문장입니다. 세 번째 문장입니다.", "두 번째 문단입니다.", "마지막 문단입니다."]);
  assert.equal(getStoryExcerpt("\n첫 문단입니다.\n둘째 문단입니다."), "첫 문단입니다. 둘째 문단입니다.");
});

test("문단 없는 긴 글은 두 문장씩 묶고 소수·인용부호·마지막 문장을 보존한다", () => {
  const text = "면적은 34.5㎡입니다. ‘작은 공간’을 만들었습니다. 마지막 이야기입니다!";
  assert.deepEqual(getStoryParagraphs(text), ["면적은 34.5㎡입니다. ‘작은 공간’을 만들었습니다.", "마지막 이야기입니다!"]);
  assert.equal(getStoryExcerpt(text), "면적은 34.5㎡입니다. ‘작은 공간’을 만들었습니다.");
  assert.deepEqual(getStoryParagraphs("긴 문장이지만 마침표가 없는 글"), ["긴 문장이지만 마침표가 없는 글"]);
  assert.deepEqual(getStoryParagraphs(""), []);
});

test("HTML처럼 보이는 내용도 변환하지 않고 일반 문자열로 유지한다", () => {
  assert.equal(getStoryExcerpt("<script>alert(1)</script>"), "<script>alert(1)</script>");
});

test("설명 없는 상태와 임시 문구는 숨기고 실제 설명은 보존한다", () => {
  for (const text of [undefined, "", "설명없음", " 설명 없음. ", "설명이 없습니다.", "설명란입니다.", "내용없음"]) {
    assert.equal(getPublicStory(text), "");
    assert.equal(getStoryExcerpt(text), "");
    assert.deepEqual(getStoryParagraphs(text ?? ""), []);
  }
  assert.equal(getPublicStory("설명 없음이라는 문구를 지웠습니다."), "설명 없음이라는 문구를 지웠습니다.");
  assert.equal(getPublicStory("공간에 관한 실제 이야기입니다."), "공간에 관한 실제 이야기입니다.");
});

test("미리보기의 문장별 줄나눔은 소수와 인용문, 원문 내용을 보존한다", () => {
  const text = "면적은 34.5㎡입니다. ‘작은 공간’을 만들었습니다. 다음 이야기입니다.";
  assert.deepEqual(getStoryOpeningSentences(text), ["면적은 34.5㎡입니다.", "‘작은 공간’을 만들었습니다."]);
  assert.equal(getStoryOpeningSentences(text).join(" "), getStoryExcerpt(text));
  assert.deepEqual(getStoryOpeningSentences("설명 없음"), []);
});
