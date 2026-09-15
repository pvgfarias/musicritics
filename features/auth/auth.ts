import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin, username } from 'better-auth/plugins';
import { prisma } from '@/lib/prisma';
import {
  ac,
  admin as adminRole,
  moderator,
  user,
} from '@/features/permissions/access';
import { sendVerificationEmail, sendResetPasswordEmail } from './email';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),

  user: {
    // Off by default in better-auth — needed for the account settings page
    // to be able to change email at all. Reuses the same
    // emailVerification.sendVerificationEmail callback below to verify the
    // new address before the change takes effect.
    changeEmail: {
      enabled: true,
    },
  },

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

// Infer and export types directly from the auth instance
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
