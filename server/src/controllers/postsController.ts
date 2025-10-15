import { Request, Response } from "express";
import { postsService } from "../services/postsService";

export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, image_url, tags, authorId } = req.body;

        const post = await postsService.createPost({
            title,
            content,
            image_url,
            tags,
            authorId: Number(authorId),
        });

        res.status(201).json({ data: post });
    } catch (error: any) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
};

export const getPosts = async (req: Request, res: Response) => {
    try {
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const userId = req.query.userId ? Number(req.query.userId) : undefined;
        const search = req.query.search as string | undefined;
        const tag = req.query.tag as string | undefined;
        const hasImage =
            typeof req.query.hasImage !== "undefined"
                ? req.query.hasImage === "true"
                : undefined;

        let sort: "recent" | "popular" | undefined;
        const sortParam = req.query.sort as string | undefined;
        if (sortParam === "recent" || sortParam === "popular") {
            sort = sortParam;
        }

        const result = await postsService.getPosts({
            page,
            limit,
            userId,
            search,
            tag,
            hasImage,
            sort,
        });

        res.json({
            data: result.posts,
            meta: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit),
            },
        });
    } catch (error: any) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
        const postId = Number(req.params.id);
        const post = await postsService.getPostById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.json({ data: post });
    } catch (error: any) {
        console.error("Error fetching post:", error);
        res.status(500).json({ error: "Failed to fetch post" });
    }
};

export const updatePost = async (req: Request, res: Response) => {
    try {
        const postId = Number(req.params.id);
        const { title, content, tags, image_url } = req.body;

        const updated = await postsService.updatePost(postId, {
            title,
            content,
            tags,
            image_url,
        });

        res.json({ data: updated });
    } catch (error: any) {
        console.error("Error updating post:", error);
        res.status(500).json({ error: "Failed to update post" });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const postId = Number(req.params.id);
        const deleted = await postsService.deletePost(postId);
        res.json({ data: deleted });
    } catch (error: any) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Failed to delete post" });
    }
};
