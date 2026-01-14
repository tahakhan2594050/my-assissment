import express from "express";
import { adminAuth } from "../middlewares/adminAuth.js";
import { getAllUsers, createUser, updateUser, deleteUser, getAllCreations, deleteCreation, getSystemStats } from "../controllers/adminController.js";

const adminRouter = express.Router();

// Admin authentication middleware for all routes
adminRouter.use(adminAuth);

// User management routes
adminRouter.get('/users', getAllUsers);
adminRouter.post('/users', createUser);
adminRouter.put('/users/:id', updateUser);
adminRouter.delete('/users/:id', deleteUser);

// Content management routes
adminRouter.get('/creations', getAllCreations);
adminRouter.delete('/creations/:id', deleteCreation);

// System statistics
adminRouter.get('/stats', getSystemStats);

export default adminRouter;