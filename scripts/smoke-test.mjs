import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const port = Number(process.env.PORT || 4173);
const origin = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)],
  { stdio: "inherit", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } }
);

const pages = [
  "/", "/about", "/how-it-works", "/calculator", "/vehicle-import",
  "/vehicles", "/vin-check", "/compare", "/shipping", "/account",
  "/privacy-policy", "/terms"
];

async function waitForServer() {
  let lastError;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Production server exited early with code ${server.exitCode}.`);
    }
    try {
      const response = await fetch(origin, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return;
      lastError = new Error(`Server returned HTTP ${response.status} while starting.`);
    } catch (error) {
      lastError = error;
    }
    await delay(400);
  }
  throw new Error(`Production server did not become ready: ${lastError instanceof Error ? lastError.message : "unknown error"}`);
}

try {
  await waitForServer();

  for (const path of pages) {
    const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(8000) });
    assert.equal(response.status, 200, `${path} should return HTTP 200`);
    assert.match(
      response.headers.get("content-type") || "",
      /text\/html/i,
      `${path} should return HTML`
    );
    const html = await response.text();
    assert.match(html, /<main[^>]+id="main-content"/i, `${path} should render the main landmark`);
    assert.match(html, /Portavero/i, `${path} should include the site identity`);
    console.log(`PASS ${path}`);
  }

  for (const [path, expectedType] of [["/robots.txt", /text\/plain/i], ["/sitemap.xml", /xml/i]]) {
    const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(8000) });
    assert.equal(response.status, 200, `${path} should return HTTP 200`);
    assert.match(response.headers.get("content-type") || "", expectedType, `${path} should use the expected content type`);
    console.log(`PASS ${path}`);
  }

  const headers = await fetch(origin, { signal: AbortSignal.timeout(8000) });
  const expectedHeaders = {
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    "strict-transport-security": "max-age=31536000; includeSubDomains"
  };
  for (const [name, expected] of Object.entries(expectedHeaders)) {
    assert.equal(headers.headers.get(name), expected, `Expected ${name} security header`);
  }
  assert.equal(headers.headers.get("x-powered-by"), null, "Next.js powered-by header should be disabled");
  console.log("PASS baseline HTTP security headers");

  const invalidVin = await fetch(new URL("/api/vin-check", origin), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vin: "short" }),
    signal: AbortSignal.timeout(8000)
  });
  assert.equal(invalidVin.status, 400, "Invalid VIN should be rejected before contacting the upstream decoder");
  const invalidVinBody = await invalidVin.json();
  assert.equal(typeof invalidVinBody.error, "string", "Invalid VIN response should contain a readable error");
  console.log("PASS VIN API rejects invalid input locally");

  console.log(`Production smoke tests passed for ${pages.length} pages, 2 metadata routes, security headers and VIN input validation.`);
} finally {
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    await Promise.race([
      new Promise((resolve) => server.once("exit", resolve)),
      delay(2500)
    ]);
    if (server.exitCode === null) server.kill("SIGKILL");
  }
}
