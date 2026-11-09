import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { Console } from "node:console";
import { spawn } from "node:child_process";
import { request as httpRequest } from "node:http";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";
import { URL } from "node:url";

const output = new Console(process.stdout, process.stderr);
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

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const body = options.body;
    const req = httpRequest(new URL(path, origin), {
      method: options.method || "GET",
      headers: {
        ...(options.headers || {}),
        ...(body ? { "Content-Length": Buffer.byteLength(body) } : {})
      }
    }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve({
        status: response.statusCode,
        headers: response.headers,
        body: Buffer.concat(chunks).toString("utf8")
      }));
    });
    req.setTimeout(8000, () => req.destroy(new Error(`Request timed out: ${path}`)));
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function waitForServer() {
  let lastError;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Production server exited early with code ${server.exitCode}.`);
    }
    try {
      const response = await request("/");
      if (response.status === 200) return;
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
    const response = await request(path);
    assert.equal(response.status, 200, `${path} should return HTTP 200`);
    assert.match(
      String(response.headers["content-type"] || ""),
      /text\/html/i,
      `${path} should return HTML`
    );
    assert.match(response.body, /<main[^>]+id="main-content"/i, `${path} should render the main landmark`);
    assert.match(response.body, /Portavero/i, `${path} should include the site identity`);
    output.log(`PASS ${path}`);
  }

  for (const [path, expectedType] of [["/robots.txt", /text\/plain/i], ["/sitemap.xml", /xml/i]]) {
    const response = await request(path);
    assert.equal(response.status, 200, `${path} should return HTTP 200`);
    assert.match(String(response.headers["content-type"] || ""), expectedType, `${path} should use the expected content type`);
    output.log(`PASS ${path}`);
  }

  const response = await request("/");
  const expectedHeaders = {
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    "strict-transport-security": "max-age=31536000; includeSubDomains"
  };
  for (const [name, expected] of Object.entries(expectedHeaders)) {
    assert.equal(response.headers[name], expected, `Expected ${name} security header`);
  }
  assert.equal(response.headers["x-powered-by"], undefined, "Next.js powered-by header should be disabled");
  output.log("PASS baseline HTTP security headers");

  const invalidVin = await request("/api/vin-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vin: "short" })
  });
  assert.equal(invalidVin.status, 400, "Invalid VIN should be rejected before contacting the upstream decoder");
  const invalidVinBody = JSON.parse(invalidVin.body);
  assert.equal(typeof invalidVinBody.error, "string", "Invalid VIN response should contain a readable error");
  output.log("PASS VIN API rejects invalid input locally");

  output.log(`Production smoke tests passed for ${pages.length} pages, 2 metadata routes, security headers and VIN input validation.`);
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
