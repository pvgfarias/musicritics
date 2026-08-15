import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin, username } from 'better-auth/plugins';
import { prisma } from '@/lib/prisma';
import { ac, admin as adminRole, moderator, user } from '@/lib/permissions';
import { sendVerificationEmail, sendResetPasswordEmail } from '@/lib/email';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({ emailRecipient: user.email, url });
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({ emailRecipient: user.email, url });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  plugins: [
    username(),
    admin({
      ac,
      roles: { admin: adminRole, moderator, user },
      defaultRole: 'user',
      adminRoles: ['admin'],
    }),
  ],
});
