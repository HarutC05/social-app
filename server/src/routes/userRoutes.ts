import { Router } from "express";
import path from "path";
import multer from "multer";
import { auth } from "../middleware/auth";
import fs from "fs";
import {
    getAllUsers,
    getUserById,
    updateUser,
    getUserByEmail,
    deleteUser,
    uploadAvatar,
    changePassword,
} from "../controllers/userController";

const router = Router();

const uploadsDir = path.join(__dirname, "../../uploads/avatars");
if (!fs.existsSync(path.join(__dirname, "../../uploads")))
    fs.mkdirSync(path.join(__dirname, "../../uploads"));
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `avatar_${req.params.id}_${Date.now()}${ext}`);
    },
});
const upload = multer({ storage });

router.get("/", auth, getAllUsers);

router.get("/email/:email", auth, getUserByEmail);
router.get("/:id", auth, getUserById);
router.patch("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);
router.post("/:id/avatar", auth, upload.single("avatar"), uploadAvatar);
router.post("/:id/password", auth, changePassword);

export { router as userRoutes };
