import { requireAuth } from "@clerk/express";
import User from "../models/user.model.js";

const requireUser = requireAuth();

export { requireUser };

export const protect = (req, res, next) => {
  requireUser(req, res, async () => {
    try {
      const user = await User.findOne({ clerkId: req.auth.userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

export default protect;
