import { postsService } from "../services/postsService";
import { Request, Response, NextFunction } from "express";

export async function createPost(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const newPost = await postsService.createPost(req.body);
        res.status(201).json({
            message: "Successfully created post",
            data: newPost,
        });
    } catch (error) {
        next(error);
    }
}

export async function getPostById(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const post = await postsService.getPostById(Number(req.params.id));
        res.status(200).json({
            message: "Successfully fetched post",
            data: post,
        });
    } catch (error) {
        next(error);
    }
}

export async function getPosts(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const userId = req.query.userId ? Number(req.query.userId) : undefined;
        const { posts, total } = await postsService.getPosts({
            page,
            limit,
            userId,
        });
        const totalPages = Math.ceil(total / (limit || 1));
        res.status(200).json({
            message: "Successfully fetched posts",
            data: posts,
            meta: { total, page, limit, totalPages },
        });
    } catch (error) {
        next(error);
    }
}

export async function updatePost(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const updatedPost = await postsService.updatePost(
            Number(req.params.id),
            req.body
        );
        res.status(200).json({
            message: "Successfully updated post",
            data: updatedPost,
        });
    } catch (error) {
        next(error);
    }
}

export async function deletePost(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const deletedPost = await postsService.deletePost(
            Number(req.params.id)
        );
        res.status(200).json({
            message: "Successfully deleted post",
            data: deletedPost,
        });
    } catch (error) {
        next(error);
    }
}
