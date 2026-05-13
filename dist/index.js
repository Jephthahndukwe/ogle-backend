"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const node_1 = require("better-auth/node");
const auth_1 = require("./auth");
const users_1 = __importDefault(require("./routes/users"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:8081',
        'exp://localhost:8081',
        process.env.BETTER_AUTH_URL || '',
    ],
    credentials: true,
}));
// Better Auth handles all /api/auth/* routes
app.use('/api/auth', (0, node_1.toNodeHandler)(auth_1.auth));
app.use(express_1.default.json());
// Your API routes
app.use('/api/v1/users', users_1.default);
app.use('/api/v1/dashboard', dashboard_1.default);
// Health check
app.get('/api/v1/health', (_, res) => {
    res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});
const PORT = process.env.PORT || 3000;
(0, db_1.connectDB)().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
