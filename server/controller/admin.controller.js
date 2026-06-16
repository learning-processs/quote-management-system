import userModel from '../models/userModel.js';
import quoteModel from '../models/quoteModel.js';

// @GET /api/admin/stats
export const getStats = async (req, resp) => {
  try {
    const [totalQuotes, pendingQuotes, totalUsers] = await Promise.all([
      quoteModel.countDocuments(),
      quoteModel.countDocuments({ status: 'pending' }),
      userModel.countDocuments(),
    ]);
    
    return resp.status(200).json({
      success: true,
      data: { totalQuotes, pendingQuotes, totalUsers },
    });
  } catch (err) {
    return resp.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/admin/quotes
export const getAllQuotes = async (req, resp) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status)   filter.status   = status;
    if (category) filter.category = category;
    
    const skip   = (page - 1) * limit;
    const total  = await quoteModel.countDocuments(filter);
    const quotes = await quoteModel.find(filter)
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    return resp.status(200).json({
      success: true,
      data: { quotes, total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return resp.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/admin/quotes/:id/approve
export const approveQuote = async (req, resp) => {
  try {
    const quote = await quoteModel.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!quote)
      return resp.status(404).json({ success: false, message: 'Quote not found.' });
    return resp.status(200).json({ success: true, message: 'Quote approved.', data: { quote } });
  } catch (err) {
    return resp.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/admin/quotes/:id/reject
export const rejectQuote = async (req, resp) => {
  try {
    const quote = await quoteModel.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!quote)
      return resp.status(404).json({ success: false, message: 'Quote not found.' });
    return resp.status(200).json({ success: true, message: 'Quote rejected.', data: { quote } });
  } catch (err) {
    return resp.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/admin/quotes/:id
export const deleteQuote = async (req, resp) => {
  try {
    const quote = await quoteModel.findByIdAndDelete(req.params.id);
    if (!quote)
      return resp.status(404).json({ success: false, message: 'Quote not found.' });
    return resp.status(200).json({ success: true, message: 'Quote deleted.' });
  } catch (err) {
    return resp.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/admin/users
export const getAllUsers = async (req, resp) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    
    const skip  = (page - 1) * limit;
    const total = await userModel.countDocuments(filter);
    const users = await userModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    return resp.status(200).json({ success: true, data: { users, total } });
  } catch (err) {
    return resp.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/admin/users/:id/role
export const changeRole = async (req, resp) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role))
      return resp.status(400).json({ success: false, message: 'Invalid role.' });
      
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user)
      return resp.status(404).json({ success: false, message: 'User not found.' });
    return resp.status(200).json({ success: true, message: `Role updated to ${role}.`, data: { user } });
  } catch (err) {
    return resp.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/admin/users/:id/ban
export const banUser = async (req, resp) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user)
      return resp.status(404).json({ success: false, message: 'User not found.' });
      
    user.isBanned = !user.isBanned;
    await user.save();
    return resp.status(200).json({
      success: true,
      message: user.isBanned ? 'User banned.' : 'User unbanned.',
      data: { user },
    });
  } catch (err) {
    return resp.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/admin/users/:id
export const deleteUser = async (req, resp) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user)
      return resp.status(404).json({ success: false, message: 'User not found.' });
      
    await quoteModel.deleteMany({ submittedBy: req.params.id });
    return resp.status(200).json({ success: true, message: 'User and their quotes deleted.' });
  } catch (err) {
    return resp.status(500).json({ success: false, message: err.message });
  }
};