import express from 'express';
import { adminLogin, getMe, login, register  } from "../controller/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/admin-login',  adminLogin);  // ← new
authRouter.get('/me',authMiddleware, getMe);

export default authRouter;