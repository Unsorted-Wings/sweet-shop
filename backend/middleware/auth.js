import jwt from 'jsonwebtoken';

/**
 * JWT Authentication Middleware
 * Verifies JWT tokens and adds user information to request object
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  // Check if Authorization header exists
  if (!authHeader) {
    return res.status(401).json({ error: 'Access token is required' });
  }
  
  // Check if Authorization header has correct format (Bearer <token>)
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Invalid token format. Use Bearer <token>' });
  }
  
  // Extract token from "Bearer <token>"
  const token = authHeader.substring(7);
  
  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user information to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name
    };
    
    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Role-based authorization middleware
 * Requires specific role to access the route
 */
export function requireRole(role) {
  return (req, res, next) => {
    // Check if user is authenticated (should be called after authenticateToken)
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check if user has required role
    if (req.user.role !== role) {
      return res.status(403).json({ error: `Access denied. ${role} role required` });
    }
    
    next();
  };
}

/**
 * Admin-only middleware
 * Shorthand for requireRole('admin')
 */
export function requireAdmin(req, res, next) {
  return requireRole('admin')(req, res, next);
}
