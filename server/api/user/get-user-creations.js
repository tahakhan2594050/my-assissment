import { clerkClient } from '@clerk/express';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

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

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Auth check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token with Clerk
    let userId;
    try {
      const payload = await clerkClient.verifyToken(token);
      if (!payload || !payload.sub) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
      userId = payload.sub;
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ success: false, message: 'Token verification failed' });
    }

    // Get user creations from database
    try {
      const creations = await sql`
        SELECT * FROM creations 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC
      `;

      res.status(200).json({
        success: true,
        creations: creations || [],
        count: creations ? creations.length : 0
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Return dummy data if database fails
      const dummyCreations = [
        {
          id: 1,
          title: 'Sample AI Article',
          content: 'This is a sample AI-generated article...',
          type: 'article',
          created_at: new Date().toISOString(),
          user_id: userId
        },
        {
          id: 2,
          title: 'Sample Blog Title',
          content: 'Amazing Blog Title Ideas for Your Content',
          type: 'blog-title',
          created_at: new Date().toISOString(),
          user_id: userId
        }
      ];

      res.status(200).json({
        success: true,
        creations: dummyCreations,
        count: dummyCreations.length,
        note: 'Using dummy data - database connection issue'
      });
    }
  } catch (error) {
    console.error('Get user creations error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
}