import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

export let mongoClient: MongoClient;

export const connectDB = async () => {
  try {
    mongoClient = new MongoClient(process.env.MONGODB_URI!); // created HERE, after dotenv loaded
    await mongoClient.connect();
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// User model (extends Better Auth's user with your fields)
const userSchema = new mongoose.Schema({
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

export const User = mongoose.model('User', userSchema);