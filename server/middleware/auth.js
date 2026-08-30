const jwt = require('jsonwebtoken');

// Middleware jo authentication aur role-permission check karega
module.exports = (roles = []) => {
  if (typeof roles === 'string') roles = [roles]; // single role allowed ho to bhi array bana do

  return (req, res, next) => {
    // Header se token read
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
      // Token verify
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;

      // Role check (agar roles required hue)
      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};
