import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { preventPublicImageAction } from "../src/shared/publicImageProtection.ts";

const originalElement = globalThis.Element;
class TestElement extends EventTarget {
  constructor(onImage) {
    super();
    this.onImage = onImage;
  }
  closest(selector) {
    assert.equal(selector, "img, picture");
    return this.onImage ? this : null;
  }
}
test.before(() => { globalThis.Element = TestElement; });
test.after(() => {
  if (originalElement === undefined) delete globalThis.Element;
  else globalThis.Element = originalElement;
});

function action(target) {
  const event = { target, prevented: false, preventDefault() { this.prevented = true; } };
  preventPublicImageAction(event);
  return event.prevented;
}

test("공개 이미지의 메뉴 열기와 드래그 기본 동작을 막는다", () => {
  assert.equal(action(new TestElement(true)), true);
});
test("일반 텍스트와 링크의 메뉴 및 선택 동작은 유지한다", () => {
  assert.equal(action(new TestElement(false)), false);
});
test("요소가 아닌 이벤트 대상은 막지 않는다", () => {
  assert.equal(action(null), false);
  assert.equal(action(new EventTarget()), false);
});
test("모바일 이미지 길게 누르기 억제 CSS는 공개 이미지에만 적용한다", () => {
  const css = readFileSync(new URL("../src/shared/publicImageProtection.css", import.meta.url), "utf8");
  assert.match(css, /\.sowa-protected-images img\s*\{/);
  assert.match(css, /-webkit-touch-callout:\s*none/);
  assert.match(css, /-webkit-user-drag:\s*none/);
  assert.doesNotMatch(css, /touch-action:\s*none|pointer-events:\s*none/);
});
