import { Router } from "express";
import {
    getCommentsByPostId,
    createComment,
    updateComment,
    deleteComment,
} from "../controllers/commentsController";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/posts/:postId/comments", getCommentsByPostId);
router.post("/posts/:postId/comments", auth, createComment);
router.patch("/posts/:postId/comments/:commentId", auth, updateComment);
router.delete("/posts/:postId/comments/:commentId", auth, deleteComment);

export { router as commentsRoutes };
