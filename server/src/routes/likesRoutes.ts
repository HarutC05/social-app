import { Router } from "express";
import { likePost, unlikePost } from "../controllers/likesController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/posts/:postId/likes", auth, likePost);
router.delete("/posts/:postId/likes", auth, unlikePost);

export { router as likesRoutes };
