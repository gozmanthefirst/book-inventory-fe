// External Imports
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// Local Imports
import db from "../db/prisma";

export const auth = betterAuth({
  // DB Adapter
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  // Auth Methods
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // Trusted Origins
  trustedOrigins: ["http://localhost:3000", "https://books.gozman.dev"],
});
