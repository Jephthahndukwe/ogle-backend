"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../auth");
const db_1 = require("../db");
const router = (0, express_1.Router)();
// Middleware to require auth
const requireAuth = async (req, res, next) => {
    const session = await auth_1.auth.api.getSession({ headers: req.headers });
    if (!session) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    req.session = session;
    next();
};
// GET /users/me
router.get('/me', requireAuth, async (req, res) => {
    const session = req.session;
    const user = await db_1.User.findOne({ id: session.user.id });
    if (!user) {
        // Auto-create user record if first time (Better Auth created the auth record)
        const newUser = await db_1.User.create({
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
router.patch('/me', requireAuth, async (req, res) => {
    const session = req.session;
    const { name, phone, role, profilePhoto, isContactVisible } = req.body;
    const updated = await db_1.User.findOneAndUpdate({ id: session.user.id }, {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(role && { role }),
        ...(profilePhoto && { profilePhoto }),
        ...(isContactVisible !== undefined && { isContactVisible }),
        updatedAt: new Date(),
    }, { new: true, upsert: true });
    res.json({ success: true, data: updated });
});
exports.default = router;
