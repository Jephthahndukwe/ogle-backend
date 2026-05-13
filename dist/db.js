"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.connectDB = exports.mongoClient = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
const connectDB = async () => {
    try {
        exports.mongoClient = new mongodb_1.MongoClient(process.env.MONGODB_URI); // created HERE, after dotenv loaded
        await exports.mongoClient.connect();
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    }
    catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// User model (extends Better Auth's user with your fields)
const userSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, default: null },
    emailVerified: { type: Boolean, default: false },
    image: { type: String, default: null },
    role: { type: String, enum: ['buyer', 'agent', 'landlord', 'admin'], default: 'buyer' },
    phone: { type: String, default: null },
    verificationStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified', 'rejected'],
        default: 'unverified',
    },
    isPro: { type: Boolean, default: false },
    isContactVisible: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.User = mongoose_1.default.model('User', userSchema);
