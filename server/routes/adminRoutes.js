import express from "express";
import { adminAuth } from "../middlewares/adminAuth.js";
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getStats
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.use(adminAuth);

adminRouter.get('/users', getAllUsers);
adminRouter.get('/users/:userId', getUserById);
adminRouter.post('/users', createUser);
adminRouter.put('/users/:userId', updateUser);
adminRouter.delete('/users/:userId', deleteUser);
adminRouter.get('/stats', getStats);

export default adminRouter;
