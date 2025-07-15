import { betterAuth } from 'better-auth';
import { emailOTP } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { db } from './db';
import { env } from './env';
import { sendVerificationEmail } from './resend';
import { admin } from 'better-auth/plugins';

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        const user = await db.user.findFirst({
          where: { email },
          select: { name: true },
        });

        const name = user?.name || email.split('@')[0];

        await sendVerificationEmail(email, name, otp);
      },
    }),
    admin(),
  ],
});
