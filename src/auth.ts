import dotenv from 'dotenv';
dotenv.config();

import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { bearer, emailOTP } from 'better-auth/plugins';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,

  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      console.log(`\n=== VERIFICATION EMAIL ===`);
      console.log(`To: ${user.email}`);
      console.log(`Token/OTP: ${token}`);
      console.log(`=========================\n`);
    },
  },

  plugins: [
    bearer(),
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        console.log(`\n=== OTP CODE ===`);
        console.log(`To: ${email}`);
        console.log(`OTP: ${otp}`);
        console.log(`================\n`);
      },
      otpLength: 6,
      expiresIn: 600,
    }),
  ],

  trustedOrigins: [
    'ogle://',
    'http://localhost:8081',
    'exp://localhost:8081',
    process.env.BETTER_AUTH_URL!,
  ],
});