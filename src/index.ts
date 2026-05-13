import dotenv from 'dotenv';
import { connectDB } from './db';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth';
import usersRouter from './routes/users';
import dashboardRouter from './routes/dashboard';


const app = express();

app.use(cors({
  origin: [
    'http://localhost:8081',
    'exp://localhost:8081',
    process.env.BETTER_AUTH_URL || '',
  ],
  credentials: true,
}));

// Better Auth handles all /api/auth/* routes
app.use('/api/auth', toNodeHandler(auth));

app.use(express.json());

// Your API routes
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/dashboard', dashboardRouter);

// Health check
app.get('/api/v1/health', (_, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});