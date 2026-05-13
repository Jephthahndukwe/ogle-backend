"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../auth");
const router = (0, express_1.Router)();
const requireAuth = async (req, res, next) => {
    const session = await auth_1.auth.api.getSession({ headers: req.headers });
    if (!session) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    req.session = session;
    next();
};
// GET /dashboard/summary
router.get('/summary', requireAuth, async (req, res) => {
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
router.get('/activity', requireAuth, async (req, res) => {
    res.json({ success: true, data: { events: [] } });
});
exports.default = router;
