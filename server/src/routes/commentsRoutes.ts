import { Router } from "express";
import {
    getCommentsByPostId,
    createComment,
} from "../controllers/commentsController";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/posts/:postId/comments", getCommentsByPostId);
router.post("/posts/:postId/comments", auth, createComment);

export { router as commentsRoutes };
