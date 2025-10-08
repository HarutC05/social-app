import { Request, Response } from "express";
import { commentsService } from "../services/commentsService";

export const getCommentsByPostId = async (req: Request, res: Response) => {
    try {
        const postId = Number(req.params.postId);
        if (isNaN(postId)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }
        const comments = await commentsService.getCommentsByPostId(postId);
        res.json({ data: comments });
    } catch (error) {
        console.error("Error getting comments:", error);
        res.status(500).json({ message: "Failed to fetch comments" });
    }
};

export const createComment = async (req: Request, res: Response) => {
    try {
        const postId = Number(req.params.postId);
        const { content } = req.body;
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!content || typeof content !== "string") {
            return res.status(400).json({ message: "Invalid content" });
        }

        const comment = await commentsService.createComment({
            postId,
            authorId: user.id,
            content,
        });

        res.status(201).json({ data: comment });
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Failed to create comment" });
    }
};
