import { Router } from "express";
import { auth } from "../middleware/auth";

import {
    getUserById,
    updateUser,
    getUserByEmail,
    deleteUser,
} from "../controllers/userController";

const router = Router();

router.get("/email/:email", auth, getUserByEmail);
router.get("/:id", auth, getUserById);
router.patch("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

export { router as userRoutes };
