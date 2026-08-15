import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationEmail({
  to,
  url,
}: {
  to: string;
  url: string;
}) {
  await resend.emails.send({
    from: 'Musicritics <onboarding@musicritics.vercel.app',
    to,
    subject: 'Verify Your Email',
    html: `<p>Click below to verify your email and finish signing up.</p>
           <p><a href="${url}">Verify email</a></p>
           <p>If you didn't request this, ignore this email.</p>`,
  });
}

export async function sendResetPasswordEmail({
  to,
  url,
}: {
  to: string;
  url: string;
}) {
  await resend.emails.send({
    from: 'Musicritics <onboarding@musicritics.vercel.app',
    to,
    subject: 'Verify Your Email',
    html: `<p>Click below to reset your password.</p>
           <p><a href="${url}">Reset password</a></p>
           <p>If you didn't request this, ignore this email.</p>`,
  });
}
