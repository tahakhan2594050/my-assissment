import { clerkClient } from "@clerk/express";
import sql from "../configs/db.js";

// Get all users from Clerk
export const getAllUsers = async (req, res) => {
    try {
        const userList = await clerkClient.users.getUserList({
            limit: 100,
            orderBy: '-created_at'
        });

        const users = userList.data.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddresses[0]?.emailAddress || 'No email',
            imageUrl: user.imageUrl,
            createdAt: user.createdAt,
            isAdmin: user.publicMetadata?.isAdmin === true || user.privateMetadata?.isAdmin === true,
            plan: user.publicMetadata?.plan || 'free'
        }));

        res.json({ success: true, users });
    } catch (error) {
        console.error('Get all users error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single user by ID
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await clerkClient.users.getUser(userId);
        
        res.json({
            success: true,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.emailAddresses[0]?.emailAddress || 'No email',
                imageUrl: user.imageUrl,
                createdAt: user.createdAt,
                isAdmin: user.publicMetadata?.isAdmin === true || user.privateMetadata?.isAdmin === true,
                plan: user.publicMetadata?.plan || 'free',
                metadata: user.publicMetadata
            }
        });
    } catch (error) {
        console.error('Get user error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create new user
export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        const user = await clerkClient.users.createUser({
            firstName: firstName || '',
            lastName: lastName || '',
            emailAddress: [email],
            password: password,
            skipPasswordChecks: false,
            publicMetadata: {
                plan: 'free'
            }
        });

        res.json({
            success: true,
            message: "User created successfully",
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.emailAddresses[0]?.emailAddress,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Create user error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName, email, password, isAdmin, plan } = req.body;

        const updateData = {};

        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (email !== undefined) {
            updateData.emailAddress = [email];
        }
        if (password !== undefined && password !== '') {
            updateData.password = password;
        }

        const user = await clerkClient.users.getUser(userId);
        const currentMetadata = user.publicMetadata || {};
        
        if (isAdmin !== undefined) {
            currentMetadata.isAdmin = isAdmin;
        }
        if (plan !== undefined) {
            currentMetadata.plan = plan;
        }

        updateData.publicMetadata = currentMetadata;

        const updatedUser = await clerkClient.users.updateUser(userId, updateData);

        res.json({
            success: true,
            message: "User updated successfully",
            user: {
                id: updatedUser.id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.emailAddresses[0]?.emailAddress,
                isAdmin: updatedUser.publicMetadata?.isAdmin === true,
                plan: updatedUser.publicMetadata?.plan || 'free'
            }
        });
    } catch (error) {
        console.error('Update user error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        await clerkClient.users.deleteUser(userId);
        await sql`DELETE FROM creations WHERE user_id = ${userId}`;

        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error('Delete user error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get admin statistics
export const getStats = async (req, res) => {
    try {
        const userList = await clerkClient.users.getUserList({ limit: 1000 });
        const totalUsers = userList.totalCount;

        const [creationsCount] = await sql`SELECT COUNT(*) as count FROM creations`;
        const [publishedCount] = await sql`SELECT COUNT(*) as count FROM creations WHERE publish = true`;

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalCreations: parseInt(creationsCount.count),
                publishedCreations: parseInt(publishedCount.count)
            }
        });
    } catch (error) {
        console.error('Get stats error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
