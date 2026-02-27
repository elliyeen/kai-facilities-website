import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const INQUIRY_LABELS: Record<string, string> = {
  demo:         "Platform Demo",
  pilot:        "FIFA 2026 Pilot Program",
  rfp:          "RFP Response",
  consultation: "Strategic Consultation",
  general:      "General Inquiry",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, phone, inquiryType, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const inquiryLabel = INQUIRY_LABELS[inquiryType] ?? inquiryType;

    await transporter.sendMail({
      from: `"KAI Website" <${process.env.GMAIL_USER}>`,
      to: "abdullah@elliyeen.com",
      replyTo: email,
      subject: `[KAI] ${inquiryLabel} — ${name}${company ? ` @ ${company}` : ""}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <div style="border-bottom: 2px solid #000; padding-bottom: 24px; margin-bottom: 32px;">
            <p style="font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #888; margin: 0 0 8px;">KAI — New Inquiry</p>
            <h1 style="font-size: 28px; font-weight: 300; margin: 0; letter-spacing: -0.02em;">${inquiryLabel}</h1>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; width: 140px;">Name</td>
              <td style="padding: 12px 0; font-size: 16px; font-weight: 300;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888;">Email</td>
              <td style="padding: 12px 0; font-size: 16px; font-weight: 300;"><a href="mailto:${email}" style="color: #000;">${email}</a></td>
            </tr>
            ${company ? `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888;">Organization</td>
              <td style="padding: 12px 0; font-size: 16px; font-weight: 300;">${company}</td>
            </tr>` : ""}
            ${phone ? `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888;">Phone</td>
              <td style="padding: 12px 0; font-size: 16px; font-weight: 300;">${phone}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 12px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888;">Inquiry</td>
              <td style="padding: 12px 0; font-size: 16px; font-weight: 300;">${inquiryLabel}</td>
            </tr>
          </table>

          ${message ? `
          <div style="border-top: 1px solid #eee; padding-top: 24px; margin-bottom: 32px;">
            <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; margin: 0 0 12px;">Message</p>
            <p style="font-size: 16px; font-weight: 300; line-height: 1.6; color: #333; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>` : ""}

          <div style="border-top: 1px solid #eee; padding-top: 24px;">
            <p style="font-size: 12px; color: #aaa; margin: 0;">
              Reply to this email to respond directly to ${name}.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
