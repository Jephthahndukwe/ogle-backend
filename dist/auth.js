"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const better_auth_1 = require("better-auth");
const mongodb_1 = require("better-auth/adapters/mongodb");
const plugins_1 = require("better-auth/plugins");
const mongodb_2 = require("mongodb");
const client = new mongodb_2.MongoClient(process.env.MONGODB_URI);
const db = client.db();
exports.auth = (0, better_auth_1.betterAuth)({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: (0, mongodb_1.mongodbAdapter)(db),
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
        (0, plugins_1.bearer)(),
        (0, plugins_1.emailOTP)({
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
        process.env.BETTER_AUTH_URL,
    ],
});
