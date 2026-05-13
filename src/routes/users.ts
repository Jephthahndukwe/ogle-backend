import { Router, Request, Response } from 'express';
import { auth } from '../auth';

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
  res.json({ success: true, data: session.user });
});

// PATCH /users/me
router.patch('/me', requireAuth, async (req: Request, res: Response) => {
  const session = (req as any).session;
  const { name, phone, role, profilePhoto, isContactVisible } = req.body;

  const updated = await auth.api.updateUser({
    body: {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(role && { role }),
      ...(profilePhoto && { profilePhoto }),
      ...(isContactVisible !== undefined && { isContactVisible }),
    },
    headers: req.headers as any,
  });

  res.json({ success: true, data: updated });
});

export default router;