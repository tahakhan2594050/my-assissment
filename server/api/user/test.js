import { clerkClient } from '@clerk/express';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Simple auth check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token with Clerk
    try {
      const payload = await clerkClient.verifyToken(token);
      if (!payload) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Token verification failed' });
    }

    if (req.method === 'GET') {
      res.status(200).json({
        success: true,
        message: 'User endpoint is working',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('User test endpoint error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
}