import { Router, Request, Response } from 'express';
import { auth } from '../auth';
import { User } from '../db';

const router = Router();

// Middleware to require auth
const requireAuth = async (req: Request, res: Response, next: Function) => {
  const session = await auth.api.getSession({ headers: req.headers as any });
  if (!session) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  (req as any).session = session;
  next();
};

// GET /users/me
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const session = (req as any).session;
  const user = await User.findOne({ id: session.user.id });

  if (!user) {
    // Auto-create user record if first time (Better Auth created the auth record)
    const newUser = await User.create({
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      emailVerified: session.user.emailVerified,
    });
    return res.json({ success: true, data: newUser });
  }

  res.json({ success: true, data: user });
});

// PATCH /users/me
router.patch('/me', requireAuth, async (req: Request, res: Response) => {
  const session = (req as any).session;
  const { name, phone, role, profilePhoto, isContactVisible } = req.body;

  const updated = await User.findOneAndUpdate(
    { id: session.user.id },
    {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(role && { role }),
      ...(profilePhoto && { profilePhoto }),
      ...(isContactVisible !== undefined && { isContactVisible }),
      updatedAt: new Date(),
    },
    { new: true, upsert: true }
  );

  res.json({ success: true, data: updated });
});

export default router;