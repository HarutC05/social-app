import { Request, Response } from "express";
import { likesService } from "../services/likesService";

export const likePost = async (req: Request, res: Response) => {
    try {
        const postId = Number(req.params.postId);
        const user = (req as any).user;

        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const like = await likesService.likePost(user.id, postId);
        res.status(201).json({ data: like });
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ message: "Failed to like post" });
    }
};

export const unlikePost = async (req: Request, res: Response) => {
    try {
        const postId = Number(req.params.postId);
        const user = (req as any).user;

        if (!user) return res.status(401).json({ message: "Unauthorized" });

        await likesService.unlikePost(user.id, postId);
        res.status(204).send();
    } catch (error) {
        console.error("Error unliking post:", error);
        res.status(500).json({ message: "Failed to unlike post" });
    }
};
