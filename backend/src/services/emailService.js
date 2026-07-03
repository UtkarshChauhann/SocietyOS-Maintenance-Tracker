import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const hasSmtpConfig = Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass
      }
    })
  : null;

export const sendEmail = async ({ to, subject, text }) => {
  if (!hasSmtpConfig) {
    console.log('[email:dev-log]', { to, subject, text });
    return { logged: true };
  }

  return transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    text
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
    ]
      .filter(Boolean)
      .join('\n')
  });
};

export const sendImportantNoticeEmail = async ({ residents, notice }) => {
  await Promise.all(
    residents.map((resident) =>
      sendEmail({
        to: resident.email,
        subject: `Important society notice: ${notice.title}`,
        text: `Hello ${resident.name},\n\n${notice.title}\n\n${notice.content}`
      })
    )
  );
};
