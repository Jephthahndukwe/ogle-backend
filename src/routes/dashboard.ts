import { Router, Request, Response } from 'express';
import { auth } from '../auth';

const router = Router();

const requireAuth = async (req: Request, res: Response, next: Function) => {
  const session = await auth.api.getSession({ headers: req.headers as any });
  if (!session) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  (req as any).session = session;
  next();
};

// GET /dashboard/summary
router.get('/summary', requireAuth, async (req: Request, res: Response) => {
  // Stub data for now — replace with real queries later
  res.json({
    success: true,
    data: {
      totalListings: 0,
      activeListings: 0,
      totalViews: 0,
      totalSaves: 0,
      totalInquiries: 0,
      pendingReviews: 0,
    },
  });
});

// GET /dashboard/activity
router.get('/activity', requireAuth, async (req: Request, res: Response) => {
  res.json({ success: true, data: { events: [] } });
});

export default router;