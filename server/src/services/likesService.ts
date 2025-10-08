import prisma from "../models";

export interface Like {
    id: number;
    userId: number;
    postId: number;
    created_at: Date;
}

class LikesService {
    public async likePost(userId: number, postId: number): Promise<Like> {
        const existing = await prisma.like.findFirst({
            where: { userId, postId },
        });
        if (existing) return existing as Like;

        const created = await prisma.like.create({
            data: { userId, postId },
        });
        return created as Like;
    }

    public async unlikePost(userId: number, postId: number): Promise<void> {
        await prisma.like.deleteMany({
            where: { userId, postId },
        });
    }

    public async countLikes(postId: number): Promise<number> {
        return prisma.like.count({ where: { postId } });
    }

    public async hasLiked(userId: number, postId: number): Promise<boolean> {
        const like = await prisma.like.findFirst({ where: { userId, postId } });
        return !!like;
    }
}

export const likesService = new LikesService();
