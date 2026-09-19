// Worker entry: serves static assets, handles POST /api/contact.
// Contact logic: validate, honeypot-filter, store in D1, notify via Resend.
// All secrets and bindings live server-side in `env`; nothing here reaches the browser.

interface WorkerEnv {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
  CONTACT_DB: D1Database;
  RESEND_API_KEY: string;
  NOTIFY_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface D1PreparedStatement {
  bind(...values: Array<string | number | null>): D1PreparedStatement;
  run(): Promise<{ success: boolean }>;
}

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX_LENGTH = 120;
const EMAIL_MAX_LENGTH = 254;
const MESSAGE_MAX_LENGTH = 2000;
const MAX_BODY_BYTES = 32 * 1024;
const RESEND_TIMEOUT_MS = 10_000;

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function handleContact(request: Request, env: WorkerEnv): Promise<Response> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse({ ok: false, error: "invalid_content_type" }, 415);
  }
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, error: "payload_too_large" }, 413);
  }

  let payload: ContactPayload;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return jsonResponse({ ok: false, error: "invalid_json" }, 400);
    }
    payload = parsed as ContactPayload;
  } catch {
    return jsonResponse({ ok: false, error: "invalid_json" }, 400);
  }

  // Honeypot: bots fill it, humans never see it. Silently accept and change nothing.
  if (asText(payload.company) !== "") {
    return jsonResponse({ ok: true }, 200);
  }

  const name = asText(payload.name);
  const email = asText(payload.email);
  const message = asText(payload.message);

  if (!name || !email || !message) {
    return jsonResponse({ ok: false, error: "invalid_input" }, 400);
  }
  if (
    name.length > NAME_MAX_LENGTH ||
    email.length > EMAIL_MAX_LENGTH ||
    !EMAIL_PATTERN.test(email) ||
    message.length > MESSAGE_MAX_LENGTH
  ) {
    return jsonResponse({ ok: false, error: "invalid_input" }, 400);
  }

  if (!env.CONTACT_DB || !env.RESEND_API_KEY || !env.NOTIFY_EMAIL || !env.CONTACT_FROM_EMAIL) {
    console.error(JSON.stringify({ scope: "contact-api", event: "misconfigured" }));
    return jsonResponse({ ok: false, error: "server_misconfigured" }, 500);
  }

  try {
    await env.CONTACT_DB.prepare(
      "INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)",
    )
      .bind(name, email, message)
      .run();
  } catch {
    console.error(JSON.stringify({ scope: "contact-api", event: "db_insert_failed" }));
    return jsonResponse({ ok: false, error: "save_failed" }, 500);
  }

  const safeName = name.replace(/[\r\n]+/g, " ").slice(0, NAME_MAX_LENGTH);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RESEND_TIMEOUT_MS);
  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.NOTIFY_EMAIL],
        reply_to: email,
        subject: `New portfolio contact from ${safeName}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
      signal: controller.signal,
    });
    if (!resendResponse.ok) {
      console.error(
        JSON.stringify({
          scope: "contact-api",
          event: "notify_failed",
          status: resendResponse.status,
        }),
      );
      return jsonResponse({ ok: false, error: "notify_failed" }, 502);
    }
  } catch {
    console.error(JSON.stringify({ scope: "contact-api", event: "notify_error" }));
    return jsonResponse({ ok: false, error: "notify_failed" }, 502);
  } finally {
    clearTimeout(timeout);
  }

  return jsonResponse({ ok: true }, 200);
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const pathname = new URL(request.url).pathname.replace(/\/+$/, "") || "/";
    if (pathname === "/api/contact") {
      if (request.method !== "POST") {
        return jsonResponse({ ok: false, error: "method_not_allowed" }, 405);
      }
      return handleContact(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
