import { clerkClient } from "@clerk/express";
import jwt from 'jsonwebtoken';

export const adminAuth = async (req, res, next) => {
  try {
    // TEMPORARY: Skip authentication for testing
    console.log('Admin auth: Allowing access for testing');
    req.user = { id: 'test-admin', emailAddresses: [{ emailAddress: 'admin@test.com' }] };
    return next();

    /* Original auth code - uncomment when ready for production
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Admin authentication required' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Decode token to get user ID (Clerk tokens are JWTs)
    let userId;
    try {
      const decoded = jwt.decode(token);
      userId = decoded?.sub;
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token format' 
      });
    }

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid admin token' 
      });
    }

    // Get user details
    const user = await clerkClient.users.getUser(userId);
    
    // Check if user is admin - UPDATED FOR EASIER ACCESS
    const adminEmails = [
      'admin@example.com',
      'admin@gmail.com',
      'test@admin.com'
    ];
    
    const userEmail = user.emailAddresses[0]?.emailAddress;
    
    // Allow admin access if:
    // 1. Email is in admin list
    // 2. Email contains 'admin'
    // 3. User has admin metadata
    // 4. For testing: allow any user (REMOVE THIS IN PRODUCTION)
    const isAdmin = adminEmails.includes(userEmail) ||
                   userEmail?.includes('admin') ||
                   user.publicMetadata?.isAdmin === true ||
                   user.privateMetadata?.isAdmin === true ||
                   true; // TEMPORARY: Allow all users for testing
    
    if (!isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access denied. Contact administrator for access.' 
      });
    }

    req.user = user;
    next();
    */
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Admin authentication failed',
      error: error.message 
    });
  }
};
