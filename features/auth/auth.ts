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
    // new email needs to be verified if the user changes it
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
      mapProfileToUser: profile => {
        const base =
          profile.email
            .split('@')[0]
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '')
            .slice(0, 20) || 'user';
        const suffix = Math.random().toString(36).slice(2, 6);
        const username = `${base}_${suffix}`;
        return { username, displayUsername: username };
      },
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

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
