import prisma from "../models";

export interface Comment {
    id: number;
    postId: number;
    authorId: number;
    content: string;
    created_at: Date;
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
}

export const commentsService = new CommentsService();
