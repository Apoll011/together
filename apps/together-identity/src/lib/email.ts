import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASS,
  },
});

console.log(process.env.EMAIL_SERVER_USER, process.env.EMAIL_SERVER_PASS);

const FROM = process.env.EMAIL_FROM ?? "Together <noreply@example.com>";
const BASE_URL =
  process.env.NEXT_PUBLIC_IDENTITY_URL ?? "http://localhost:3001";

// ─── Templates ────────────────────────────────────────────────────────────────

function baseTemplate(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="font-family:sans-serif;max-width:560px;margin:40px auto;color:#111">
  <h2 style="color:#2563eb">Together</h2>
  ${body}
  <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb"/>
  <p style="font-size:12px;color:#6b7280">If you did not request this, you can safely ignore this email.</p>
</body>
</html>`;
}

// ─── Senders ──────────────────────────────────────────────────────────────────

export async function sendVerificationEmail(
  to: string,
  token: string
): Promise<void> {
  const url = `${BASE_URL}/verify-email?token=${token}`;
  console.log(url);
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "Verify your email — Together",
    html: baseTemplate(
      "Verify your email",
      `<p>Click the button below to verify your email address. This link expires in <strong>24 hours</strong>.</p>
       <a href="${url}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">Verify Email</a>
       <p style="margin-top:16px;font-size:13px;color:#6b7280">Or copy this URL: ${url}</p>`
    ),
  });
}

export async function sendPasswordResetEmail(
  to: string,
  token: string
): Promise<void> {
  const url = `${BASE_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "Reset your password — Together",
    html: baseTemplate(
      "Reset your password",
      `<p>We received a request to reset your password. This link expires in <strong>15 minutes</strong>.</p>
       <a href="${url}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">Reset Password</a>
       <p style="margin-top:16px;font-size:13px;color:#6b7280">Or copy this URL: ${url}</p>`
    ),
  });
}
