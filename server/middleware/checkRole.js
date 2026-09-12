import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

/**
 * Middleware to check if the user has an allowed role
 * @param {Array} allowedRoles - e.g., ['admin', 'teacher']
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    // 1. Check if Clerk auth object exists (Injected by ClerkExpressRequireAuth)
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorised access' });
    }

    // 2. Read the role from Clerk's public metadata container
    const userRole = req.auth.sessionClaims?.metadata?.role || 'student';

    // 3. Verify if the role matches the endpoint permissions
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: You do not have permission to perform this action' 
      });
    }

    // Pass the active user data forward to the next function
    next();
  };
};
