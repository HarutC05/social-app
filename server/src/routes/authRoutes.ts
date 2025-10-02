import { Router } from "express";
import { register, login, logout, getMe } from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/me", auth, getMe);

export { router as authRoutes };
