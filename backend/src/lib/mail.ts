import nodemailer, { type Transporter } from "nodemailer";
import { env } from "@/config/env";

/**
 * Email delivery for verification codes.
 *
 * When SMTP_USER/SMTP_PASS are absent the transporter is never created and
 * sendVerificationCode() logs the code to the server console instead of
 * throwing. That keeps local development working without real credentials —
 * but it is a development affordance, not a silent production fallback:
 * startup warns explicitly, and the log line makes it obvious no mail left
 * the building.
 */

const useHttpApi = Boolean(env.BREVO_API_KEY);

export const isMailConfigured = useHttpApi || Boolean(env.SMTP_USER && env.SMTP_PASS);

const isConfigured = isMailConfigured;

let transporter: Transporter | null = null;

if (useHttpApi) {
  console.info("📧 Mail transport: Brevo HTTP API (port 443)");
} else if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    // 587 is STARTTLS (secure:false + upgrade), 465 is implicit TLS.
    // Getting this backwards is the single most common cause of a silent
    // SMTP hang, so derive it from the port rather than hardcoding.
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
} else {
  console.warn(
    "⚠️  SMTP_USER/SMTP_PASS not set — verification codes will be printed to " +
    "this console instead of emailed. Set them before deploying."
  );
}

export type MailPurpose = "EMAIL_VERIFY" | "PASSWORD_RESET";

// Copy differs per purpose on purpose. A password-reset mail that says
// "confirm your address" trains people to type codes into whatever asked
// for them, which is exactly the habit phishing relies on — the message
// has to state plainly what the code will do, and what to do if the
// request wasn't theirs.
// Subject line deliberately does NOT lead with the raw code. A subject
// that starts with a bare number is one of the heuristics spam filters
// use to flag OTP-style phishing mail — putting the brand name first and
// the code at the end (still visible in the inbox preview) keeps the
// convenience without tripping that specific pattern.
// Verso branding, English throughout, matching the app's default/fallback
// locale.
const COPY: Record<MailPurpose, { subject: (c: string) => string; lead: string; footer: string }> = {
  EMAIL_VERIFY: {
    subject: (c) => `Verso — your verification code: ${c}`,
    lead: "Here is your verification code. It expires in 10 minutes.",
    footer: "If you didn't try to create a Verso account, you can ignore this email.",
  },
  PASSWORD_RESET: {
    subject: (c) => `Verso — your password reset code: ${c}`,
    lead: "Use this code to set a new password. It expires in 10 minutes.",
    footer:
      "If you didn't ask to reset your password, ignore this email — your " +
      "current password stays active and unchanged.",
  },
};

function codeEmailHtml(code: string, purpose: MailPurpose): string {
  // Deliberately plain, table-free, inline-styled markup: email clients
  // strip <style> blocks and mangle modern CSS, so anything cleverer than
  // this renders unpredictably across Gmail/Outlook/Apple Mail.
  const copy = COPY[purpose];
  // Colours match the app: warm ink on the cream canvas, the code set in the
  // brand's gold.
  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1C1917;background:#FAF6EF">
    <h1 style="font-size:20px;font-weight:700;letter-spacing:4px;margin:0 0 8px;color:#1C1917">VERSO</h1>
    <p style="font-size:15px;line-height:1.6;margin:0 0 24px;color:#57534E">
      ${copy.lead}
    </p>
    <div style="font-size:32px;font-weight:700;letter-spacing:8px;text-align:center;padding:20px;background:#F5EEE1;border:1px solid #E7D9BF;border-radius:4px;color:#8A6224">
      ${code}
    </div>
    <p style="font-size:13px;line-height:1.6;margin:24px 0 0;color:#78716C">
      ${copy.footer}
    </p>
    <p style="font-size:11px;line-height:1.6;margin:20px 0 0;color:#A8A29E;border-top:1px solid #E7E0D4;padding-top:16px">
      Verso · This is an automated message — no need to reply.
    </p>
  </div>`;
}

/** Parses `Name <addr@host>` or a bare address into Brevo's sender shape. */
function parseSender(): { name: string; email: string } {
  const raw = env.MAIL_FROM ?? env.SMTP_USER ?? "";
  const m = raw.match(/^\s*(.*?)\s*<\s*(.+?)\s*>\s*$/);
  if (m) return { name: m[1] || "Verso", email: m[2] };
  return { name: "Verso", email: raw };
}

async function sendViaHttpApi(to: string, code: string, purpose: MailPurpose): Promise<void> {
  const sender = parseSender();
  // AbortSignal.timeout so a stalled call fails fast instead of holding the
  // request open — the exact failure mode that made the SMTP path look like
  // a hung server rather than a misconfiguration.
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": env.BREVO_API_KEY!,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender,
      to: [{ email: to }],
      // A reply-to matching the sender is a small but real deliverability
      // signal — mail with no reply path at all is more consistent with
      // spam than with a real transactional sender.
      replyTo: sender,
      subject: COPY[purpose].subject(code),
      textContent: `${COPY[purpose].lead} Code: ${code}`,
      htmlContent: codeEmailHtml(code, purpose),
    }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) {
    // Brevo returns a JSON body describing the problem (bad key, unverified
    // sender, quota) — surface it in the log, since the generic message the
    // user sees deliberately says nothing about our infrastructure.
    const body = await res.text().catch(() => "");
    throw new Error(`Brevo API ${res.status}: ${body.slice(0, 300)}`);
  }
}

export async function sendVerificationCode(
  to: string,
  code: string,
  purpose: MailPurpose = "EMAIL_VERIFY"
): Promise<void> {
  if (useHttpApi) {
    try {
      await sendViaHttpApi(to, code, purpose);
      return;
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      console.error(`[mail] Brevo API delivery to ${to} failed: ${detail}`);
      const wrapped = new Error(
        "Tasdiqlash kodini yuborib bo'lmadi — keyinroq urinib ko'ring"
      ) as Error & { statusCode?: number; isOperational?: boolean; code?: string };
      wrapped.statusCode = 502;
      wrapped.isOperational = true;
      wrapped.code = "MAIL_SEND_FAILED";
      throw wrapped;
    }
  }

  if (!transporter) {
    // Printing the code is a development convenience only. In production
    // it would write a live credential into the host's log stream (Render,
    // etc.) where it is both useless to the user and a genuine leak — so
    // there it fails loudly instead, which is the honest outcome: without
    // SMTP configured, nobody can receive a code.
    if (env.NODE_ENV === "production") {
      console.error(
        `[mail] SMTP is not configured — cannot send a verification code to ${to}. ` +
        "Set SMTP_USER and SMTP_PASS."
      );
      throw new Error("Email delivery is not configured on this server");
    }
    console.info(`📧 [dev] verification code for ${to}: ${code}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: env.MAIL_FROM ?? `Verso <${env.SMTP_USER}>`,
      replyTo: env.MAIL_FROM ?? `Verso <${env.SMTP_USER}>`,
      to,
      subject: COPY[purpose].subject(code),
      // Always ship a text/plain alternative: some clients (and most spam
      // filters) treat HTML-only mail as a negative signal.
      text: `${COPY[purpose].lead} Code: ${code}`,
      html: codeEmailHtml(code, purpose),
    });
  } catch (err) {
    // A refused send is an operational condition (bad credentials, un-whitelisted
    // IP, provider outage, quota), not a bug. Log the provider's own message for the
    // operator and return a clean 502 instead of a bare 500.
    const detail = err instanceof Error ? err.message : String(err);
    console.error(`[mail] delivery to ${to} failed: ${detail}`);

    const wrapped = new Error(
      "Tasdiqlash kodini yuborib bo'lmadi — keyinroq urinib ko'ring"
    ) as Error & { statusCode?: number; isOperational?: boolean; code?: string };
    wrapped.statusCode = 502;
    wrapped.isOperational = true;
    wrapped.code = "MAIL_SEND_FAILED";
    throw wrapped;
  }
}
