/* eslint-disable @typescript-eslint/no-unused-vars */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";

import { ResetPasswordTemplate } from "@/features/email/components/reset-password-template";
import { SignUpTemplate } from "@/features/email/components/sign-up-template";
import db from "../db/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  // DB Adapter
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  // Account
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "email-password"],
    },
  },

  // Email and Password
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      const { data, error } = await resend.emails.send({
        from: "Book Inventory <books@gozman.dev>",
        to: [user.email],
        subject: "Reset your password",
        react: ResetPasswordTemplate({ url }),
      });

      if (error) {
        throw new Error(error.message);
      }
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const { data, error } = await resend.emails.send({
        from: "Book Inventory <books@gozman.dev>",
        to: [user.email],
        subject: "Sign up to Book Inventory",
        react: SignUpTemplate({ url }),
      });

      if (error) {
        throw new Error(error.message);
      }
    },
  },

  // Google OAuth
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // Trusted Origins
  trustedOrigins: ["http://localhost:3000", "https://books.gozman.dev"],
});
