import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const vercelConfig = JSON.parse(
  readFileSync(new URL("../vercel.json", import.meta.url), "utf8"),
);
const clientSource = readFileSync(
  new URL("../src/api/client.ts", import.meta.url),
  "utf8",
);

test("운영 응답에 브라우저 보안 헤더를 적용한다", () => {
  const headers = Object.fromEntries(
    vercelConfig.headers[0].headers.map(({ key, value }) => [key, value]),
  );

  assert.match(headers["Content-Security-Policy"], /default-src 'self'/);
  assert.match(headers["Content-Security-Policy"], /frame-ancestors 'none'/);
  assert.equal(headers["X-Frame-Options"], "DENY");
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.ok(headers["Permissions-Policy"]);
  assert.equal(vercelConfig.routes, undefined);
  assert.deepEqual(vercelConfig.rewrites, [
    { source: "/(.*)", destination: "/index.html" },
  ]);
});

test("변경 요청 전에 CSRF 토큰을 받아 전송한다", () => {
  assert.match(clientSource, /\/api\/dashboard-sowa\/csrf\//);
  assert.match(clientSource, /X-CSRFToken/);
  assert.match(clientSource, /SAFE_METHODS\.has\(method\)/);
});
