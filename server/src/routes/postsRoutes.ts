import { Router } from "express";
import { auth } from "../middleware/auth";

import {
    createPost,
    getPostById,
    getPosts,
    updatePost,
    deletePost,
} from "../controllers/postsController";

const router = Router();

router.get("/", getPosts);
router.post("/", auth, createPost);
router.get("/:id", getPostById);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

export { router as postsRoutes };
