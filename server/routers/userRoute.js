import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getMyQuotes, getProfile, updateProfile } from '../controller/user.controller.js';

const userRouter = express.Router();

userRouter.get('/me',authMiddleware, getProfile);
userRouter.put('/me',authMiddleware, updateProfile);
userRouter.get('/my-quotes',authMiddleware, getMyQuotes);

export default userRouter;