import prisma from "../models";

export interface Comment {
    id: number;
    postId: number;
    authorId: number;
    content: string;
    created_at: Date | null;
    author?: {
        id: number;
        username: string;
        email: string;
        avatar_url?: string | null;
    };
}

export interface CreateCommentInput {
    postId: number;
    authorId: number;
    content: string;
}

class CommentsService {
    public async getCommentsByPostId(postId: number): Promise<Comment[]> {
        const comments = await prisma.comment.findMany({
            where: { postId },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatar_url: true,
                    },
                },
            },
            orderBy: { created_at: "desc" },
        });
        return comments as Comment[];
    }

    public async createComment(data: CreateCommentInput): Promise<Comment> {
        const created = await prisma.comment.create({
            data: {
                postId: data.postId,
                authorId: data.authorId,
                content: data.content,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatar_url: true,
                    },
                },
            },
        });
        return created as Comment;
    }

    public async updateComment(
        commentId: number,
        userId: number,
        content: string
    ): Promise<Comment | null> {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment || comment.authorId !== userId) return null;

        const updated = await prisma.comment.update({
            where: { id: commentId },
            data: { content },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatar_url: true,
                    },
                },
            },
        });
        return updated;
    }

    public async deleteComment(
        commentId: number,
        userId: number
    ): Promise<boolean> {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment || comment.authorId !== userId) return false;

        await prisma.comment.delete({ where: { id: commentId } });
        return true;
    }
}

export const commentsService = new CommentsService();
