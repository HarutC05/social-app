import { Router } from "express";
import {
    register,
    login,
    logout,
    getMe,
    refresh,
} from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/me", auth, getMe);
router.post("/refresh", refresh);

export { router as authRoutes };
