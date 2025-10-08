import { Router } from "express";
import path from "path";
import multer from "multer";
import { auth } from "../middleware/auth";
import {
    getUserById,
    updateUser,
    getUserByEmail,
    deleteUser,
    uploadAvatar,
    changePassword,
} from "../controllers/userController";

const router = Router();

const uploadsDir = path.join(__dirname, "../../uploads/avatars");
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `avatar_${req.params.id}${ext}`);
    },
});
const upload = multer({ storage });

router.get("/email/:email", auth, getUserByEmail);
router.get("/:id", auth, getUserById);
router.patch("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

router.post("/:id/avatar", auth, upload.single("avatar"), uploadAvatar);
router.post("/:id/password", auth, changePassword);

export { router as userRoutes };
