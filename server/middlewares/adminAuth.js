import { clerkClient } from "@clerk/express";

// Middleware to check if user is admin
export const adminAuth = async (req, res, next) => {
    try {
        const { userId } = await req.auth();
        
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Get user from Clerk
        const user = await clerkClient.users.getUser(userId);
        
        // Check if user is admin
        const isAdmin = user.publicMetadata?.isAdmin === true || 
                       user.privateMetadata?.isAdmin === true ||
                       user.emailAddresses[0]?.emailAddress === process.env.ADMIN_EMAIL;

        if (!isAdmin) {
            return res.status(403).json({ 
                success: false, 
                message: "Access denied. Admin privileges required." 
            });
        }

        req.adminUserId = userId;
        next();
    } catch (error) {
        console.error('Admin auth error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
