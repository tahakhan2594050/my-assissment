import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    console.log('Getting all users...');
    
    // Get users from Clerk
    const clerkUsers = await clerkClient.users.getUserList({
      limit: 100,
      orderBy: '-created_at'
    });

    console.log('Clerk users fetched:', clerkUsers.data.length);

    // Get user creations count from database (with fallback)
    let userStats = [];
    try {
      userStats = await sql`
        SELECT user_id, COUNT(*) as creation_count 
        FROM creations 
        GROUP BY user_id
      `;
    } catch (dbError) {
      console.log('Database query failed, using empty stats:', dbError.message);
      userStats = [];
    }

    const users = clerkUsers.data.map(user => {
      const stats = userStats.find(stat => stat.user_id === user.id);
      return {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || 'No email',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
        creationCount: stats ? parseInt(stats.creation_count) : 0,
        imageUrl: user.imageUrl
      };
    });

    console.log('Users processed:', users.length);

    res.json({
      success: true,
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Create user (via Clerk)
export const createUser = async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    const user = await clerkClient.users.createUser({
      emailAddress: [email],
      firstName,
      lastName,
      password
    });

    res.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    const user = await clerkClient.users.updateUser(id, {
      firstName,
      lastName
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete user's creations from database (with fallback)
    try {
      await sql`DELETE FROM creations WHERE user_id = ${id}`;
    } catch (dbError) {
      console.log('Database deletion failed, continuing with user deletion:', dbError.message);
    }

    // Delete user from Clerk
    await clerkClient.users.deleteUser(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// Get all creations
export const getAllCreations = async (req, res) => {
  try {
    console.log('Getting all creations...');
    
    let creations = [];
    try {
      creations = await sql`
        SELECT * FROM creations 
        ORDER BY created_at DESC 
        LIMIT 100
      `;
    } catch (dbError) {
      console.log('Database query failed, using dummy data:', dbError.message);
      // Return dummy data if database fails
      creations = [
        {
          id: 1,
          user_id: 'dummy-user',
          title: 'Sample AI Article',
          content: 'This is a sample AI-generated article...',
          type: 'article',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          user_id: 'dummy-user',
          title: 'Sample Blog Title',
          content: 'Amazing Blog Title Ideas',
          type: 'blog-title',
          created_at: new Date().toISOString()
        }
      ];
    }

    console.log('Creations fetched:', creations.length);

    // Get user info for each creation
    const creationsWithUsers = await Promise.all(
      creations.map(async (creation) => {
        try {
          const user = await clerkClient.users.getUser(creation.user_id);
          return {
            ...creation,
            user: {
              email: user.emailAddresses[0]?.emailAddress || 'Unknown',
              firstName: user.firstName || '',
              lastName: user.lastName || ''
            }
          };
        } catch (error) {
          return {
            ...creation,
            user: {
              email: 'Unknown User',
              firstName: '',
              lastName: ''
            }
          };
        }
      })
    );

    res.json({
      success: true,
      creations: creationsWithUsers,
      total: creations.length
    });
  } catch (error) {
    console.error('Get all creations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch creations',
      error: error.message
    });
  }
};

// Delete creation
export const deleteCreation = async (req, res) => {
  try {
    const { id } = req.params;

    await sql`DELETE FROM creations WHERE id = ${id}`;

    res.json({
      success: true,
      message: 'Creation deleted successfully'
    });
  } catch (error) {
    console.error('Delete creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete creation',
      error: error.message
    });
  }
};

// Get system statistics
export const getSystemStats = async (req, res) => {
  try {
    console.log('Getting system stats...');
    
    // Get total users from Clerk
    let totalUsers = 0;
    try {
      const clerkUsers = await clerkClient.users.getUserList({ limit: 1 });
      totalUsers = clerkUsers.totalCount;
    } catch (clerkError) {
      console.log('Clerk stats failed, using fallback:', clerkError.message);
      totalUsers = 0;
    }

    // Get creation stats from database (with fallback)
    let creationStats = [{
      total_creations: 0,
      articles: 0,
      blog_titles: 0,
      images: 0,
      published_creations: 0
    }];

    try {
      const dbStats = await sql`
        SELECT 
          COUNT(*) as total_creations,
          COUNT(CASE WHEN type = 'article' THEN 1 END) as articles,
          COUNT(CASE WHEN type = 'blog-title' THEN 1 END) as blog_titles,
          COUNT(CASE WHEN type = 'image' THEN 1 END) as images,
          COUNT(CASE WHEN publish = true THEN 1 END) as published_creations
        FROM creations
      `;
      if (dbStats.length > 0) {
        creationStats = dbStats;
      }
    } catch (dbError) {
      console.log('Database stats failed, using fallback:', dbError.message);
    }

    // Get recent activity (last 7 days) with fallback
    let recentActivity = [];
    try {
      recentActivity = await sql`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM creations 
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `;
    } catch (dbError) {
      console.log('Recent activity query failed, using empty array:', dbError.message);
      recentActivity = [];
    }

    const stats = creationStats[0];

    console.log('Stats compiled successfully');

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCreations: parseInt(stats.total_creations) || 0,
        articles: parseInt(stats.articles) || 0,
        blogTitles: parseInt(stats.blog_titles) || 0,
        images: parseInt(stats.images) || 0,
        publishedCreations: parseInt(stats.published_creations) || 0,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system statistics',
      error: error.message
    });
  }
};