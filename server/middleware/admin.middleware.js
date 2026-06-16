const adminOnly = (req, resp, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return resp.status(403).json({ success: false, message: 'Access denied. Admins only.' });
};

export default adminOnly;