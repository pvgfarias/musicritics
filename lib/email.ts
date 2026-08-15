import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
});

export async function sendVerificationEmail({
  emailRecipient,
  url,
}: {
  emailRecipient: string;
  url: string;
}) {
  await brevo.transactionalEmails.sendTransacEmail({
    sender: { name: 'MusiCritics', email: 'onboarding@musicritics.vercel.app' },
    to: [{ email: emailRecipient }],
    subject: 'MusiCritics - Verify Your Email',
    textContent: `<p>Click below to verify your email and finish signing up.</p>
           <p><a href="${url}">Verify email</a></p>
           <p>If you didn't request this, ignore this email.</p>`,
  });
}

export async function sendResetPasswordEmail({
  emailRecipient,
  url,
}: {
  emailRecipient: string;
  url: string;
}) {
  await brevo.transactionalEmails.sendTransacEmail({
    sender: { name: 'MusiCritics', email: 'onboarding@musicritics.vercel.app' },
    to: [{ email: emailRecipient }],
    subject: 'MusiCritics - Verify Your Email',
    textContent: `<p>Click below to reset your password.</p>
                        <p><a href="${url}">Reset password</a></p>
                        <p>If you didn't request this, ignore this email.</p>`,
  });
}
