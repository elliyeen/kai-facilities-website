/**
 * Contact form email test
 * Run with: node --env-file .env.local scripts/test-contact.mjs
 */

import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// ── Preflight checks ────────────────────────────────────────────────────────
if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
  console.error("\n✗  Missing env vars.");
  console.error("   Create .env.local with GMAIL_USER and GMAIL_APP_PASSWORD.");
  console.error("   Then run: node --env-file .env.local scripts/test-contact.mjs\n");
  process.exit(1);
}

// ── Transporter ─────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
});

// ── Verify connection ────────────────────────────────────────────────────────
process.stdout.write("Verifying SMTP connection… ");
try {
  await transporter.verify();
  console.log("✓");
} catch (err) {
  console.error("✗\n");
  console.error("SMTP error:", err.message);
  console.error("\nCheck that:");
  console.error("  • GMAIL_USER is correct");
  console.error("  • GMAIL_APP_PASSWORD is the 16-char App Password (not your login password)");
  console.error("  • 2-Step Verification is enabled on your Google account\n");
  process.exit(1);
}

// ── Send test message ────────────────────────────────────────────────────────
process.stdout.write("Sending test message to abdullah@elliyeen.com… ");
try {
  const info = await transporter.sendMail({
    from: `"KAI Website" <${GMAIL_USER}>`,
    to: "abdullah@elliyeen.com",
    replyTo: "test@kai-test.com",
    subject: "[KAI] TEST — Contact form verification",
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <div style="border-bottom: 2px solid #000; padding-bottom: 24px; margin-bottom: 32px;">
          <p style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #888; margin: 0 0 8px;">KAI — Test Message</p>
          <h1 style="font-size: 28px; font-weight: 300; margin: 0; letter-spacing: -0.02em;">Platform Demo</h1>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; width: 140px;">Name</td>
            <td style="padding: 12px 0; font-size: 16px; font-weight: 300;">Abdullah Abbas (Test)</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888;">Email</td>
            <td style="padding: 12px 0; font-size: 16px; font-weight: 300;">test@kai-test.com</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888;">Organization</td>
            <td style="padding: 12px 0; font-size: 16px; font-weight: 300;">Elliyeen</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888;">Inquiry</td>
            <td style="padding: 12px 0; font-size: 16px; font-weight: 300;">Platform Demo</td>
          </tr>
        </table>

        <div style="border-top: 1px solid #eee; padding-top: 24px; margin-bottom: 32px;">
          <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; margin: 0 0 12px;">Message</p>
          <p style="font-size: 16px; font-weight: 300; line-height: 1.6; color: #333; margin: 0;">
            This is an automated test from the KAI contact form pipeline. If you received this, email delivery is working correctly.
          </p>
        </div>

        <div style="border-top: 1px solid #eee; padding-top: 24px;">
          <p style="font-size: 12px; color: #aaa; margin: 0;">Sent via scripts/test-contact.mjs</p>
        </div>
      </div>
    `,
  });

  console.log("✓");
  console.log(`\n   Message ID: ${info.messageId}`);
  console.log("   Check abdullah@elliyeen.com — email should arrive within 30 seconds.\n");
} catch (err) {
  console.error("✗\n");
  console.error("Send error:", err.message, "\n");
  process.exit(1);
}
