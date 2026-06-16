import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import adminOnly from '../middleware/admin.middleware.js';
import { approveQuote, banUser, changeRole, deleteQuote, deleteUser, getAllQuotes, getAllUsers, getStats, rejectQuote } from '../controller/admin.controller.js';

const adminRouter = express.Router();

adminRouter.get('/public-stats', async (req, res) => {
  try {
    const [totalQuotes, totalUsers] = await Promise.all([
      quoteModel.countDocuments({ status: 'approved' }),
      userModel.countDocuments(),
    ])
    return res.status(200).json({ success: true, data: { totalQuotes, totalUsers } })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
})

// ── All admin routes need login + admin role ──
adminRouter.use(authMiddleware, adminOnly);

// ── Stats ──
adminRouter.get('/stats', getStats);


// ── Quotes ──
adminRouter.get('/quotes', getAllQuotes);
adminRouter.put('/quotes/:id/approve', approveQuote);
adminRouter.put('/quotes/:id/reject', rejectQuote);
adminRouter.delete('/quotes/:id', deleteQuote);

// ── Users ──
adminRouter.get('/users', getAllUsers);
adminRouter.put('/users/:id/role', changeRole);
adminRouter.put('/users/:id/ban', banUser);
adminRouter.delete('/users/:id', deleteUser);

export default adminRouter;
