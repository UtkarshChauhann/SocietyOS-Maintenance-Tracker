import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const hasSmtpConfig = Boolean(env.smtp.host && env.smtp.user && env.smtp.pass && env.smtp.from);
const isProduction = env.nodeEnv === 'production';

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: Number(env.smtp.port),
      secure: env.smtp.secure,
      auth: { user: env.smtp.user, pass: env.smtp.pass }
    })
  : null;

const maskedAddress = (address) => {
  const [name, domain] = String(address).split('@');
  return domain ? `${name.slice(0, 2)}***@${domain}` : 'recipient';
};

export const verifyEmailTransport = async () => {
  if (!hasSmtpConfig) {
    console.warn(`[email] SMTP unavailable: configure SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, and SMTP_FROM (${isProduction ? 'production requests will fail' : 'development fallback enabled'})`);
    return false;
  }
  try {
    await transporter.verify();
    console.info(`[email] SMTP connection verified (${env.smtp.host}:${env.smtp.port})`);
    return true;
  } catch (error) {
    console.error('[email] SMTP verification failed:', error.message);
    return false;
  }
};

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!hasSmtpConfig) {
    if (isProduction) {
      console.error('[email] Sending failed: SMTP is not configured in production');
      throw new AppError('Password reset email service is temporarily unavailable', 503);
    }
    console.warn('[email:dev-log]', { to, subject, text });
    return { logged: true };
  }

  try {
    const result = await transporter.sendMail({ from: env.smtp.from, to, subject, text, html });
    console.info(`[email] SMTP accepted message ${result.messageId || '(no message id)'} for ${maskedAddress(to)}`);
    return result;
  } catch (error) {
    console.error(`[email] Sending failed for ${maskedAddress(to)}:`, error.message);
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
