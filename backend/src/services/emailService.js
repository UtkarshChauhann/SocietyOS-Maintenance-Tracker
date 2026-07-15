import { Resend } from 'resend';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const hasResendConfig = Boolean(env.resend.apiKey && env.resend.from);
const isProduction = env.nodeEnv === 'production';
const resend = hasResendConfig ? new Resend(env.resend.apiKey) : null;

const maskedAddress = (address) => {
  const [name, domain] = String(address).split('@');
  return domain ? `${name.slice(0, 2)}***@${domain}` : 'recipient';
};

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!hasResendConfig) {
    if (isProduction) {
      console.error('[email] Resend delivery failed: RESEND_API_KEY or EMAIL_FROM is not configured');
      throw new AppError('Password reset email service is temporarily unavailable', 503);
    }
    console.warn('[email:dev-log]', { to, subject, text });
    return { logged: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: env.resend.from,
      to,
      subject,
      text,
      html
    });

    if (error) {
      throw error;
    }

    console.info(`[email] Resend accepted message ${data?.id || '(no id)'} for ${maskedAddress(to)}`);
    return data;
  } catch (error) {
    console.error(`[email] Resend API failure for ${maskedAddress(to)}:`, error.message || error);
    throw new AppError('Password reset email service is temporarily unavailable', 503);
  }
};

export const sendPasswordResetOtpEmail = async ({ to, name, otp }) => {
  console.info(`[password-reset] OTP generated for ${maskedAddress(to)}`);
  return sendEmail({
    to,
    subject: 'Your SocietyOS password reset code',
    text: `Hello ${name || 'there'},\n\nYour SocietyOS password reset code is ${otp}. It expires in 10 minutes. Do not share this code with anyone. If you did not request this, you can ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#172033"><h2 style="color:#0f766e">SocietyOS</h2><p>Hello ${name || 'there'},</p><p>Use this one-time code to reset your password:</p><p style="font-size:30px;font-weight:700;letter-spacing:8px;color:#0f766e">${otp}</p><p>This code expires in <strong>10 minutes</strong>.</p><p><strong>Never share this code with anyone.</strong></p><p style="color:#64748b">If you did not request a password reset, you can safely ignore this email.</p></div>`
  });
};

export const sendComplaintStatusEmail = async ({ resident, complaint, oldStatus, note }) => {
  await sendEmail({
    to: resident.email,
    subject: `Complaint status updated: ${complaint.category}`,
    text: [
      `Hello ${resident.name},`,
      '',
      `Your complaint "${complaint.category}" changed from ${oldStatus} to ${complaint.status}.`,
      note ? `Admin note: ${note}` : '',
      '',
      'Please log in to view the full complaint history.'
    ].filter(Boolean).join('\n')
  });
};

export const sendImportantNoticeEmail = async ({ residents, notice }) => {
  await Promise.all(residents.map((resident) => sendEmail({
    to: resident.email,
    subject: `Important society notice: ${notice.title}`,
    text: `Hello ${resident.name},\n\n${notice.title}\n\n${notice.content}`
  })));
};
