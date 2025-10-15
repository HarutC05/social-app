import prisma from "../models";

interface CreatePostInput {
    title: string;
    content: string;
    image_url?: string | null;
    tags?: string | null;
    authorId: number;
}

interface GetPostsOptions {
    userId?: number;
    page?: number;
    limit?: number;
    search?: string;
    tag?: string;
    hasImage?: boolean;
    sort?: "recent" | "popular";
}

interface UpdatePostInput {
    title?: string;
    content?: string;
    tags?: string | null;
    image_url?: string | null;
}

interface Post {
    id: number;
    authorId: number;
    title: string;
    content: string;
    image_url?: string | null;
    tags?: string | null;
    created_at?: Date | null;
    author?: {
        id: number;
        username: string;
        email: string;
        avatar_url?: string | null;
    };
    likesCount?: number;
    commentsCount?: number;
}

class PostsService {
    public async createPost(data: CreatePostInput): Promise<Post> {
        const created = await prisma.post.create({
            data: {
                title: data.title,
                content: data.content,
                image_url: data.image_url ?? null,
                tags: data.tags ?? null,
                authorId: data.authorId,
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
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });
        return {
            ...created,
            likesCount: created._count?.likes ?? 0,
            commentsCount: created._count?.comments ?? 0,
        } as Post;
    }

    public async getPostById(postId: number): Promise<Post | null> {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatar_url: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });
        if (!post) return null;
        return {
            ...post,
            likesCount: post._count?.likes ?? 0,
            commentsCount: post._count?.comments ?? 0,
        } as Post;
    }

    public async getPosts(
        options?: GetPostsOptions
    ): Promise<{ posts: Post[]; total: number; page: number; limit: number }> {
        const page = options?.page && options.page > 0 ? options.page : 1;
        const limit = options?.limit && options.limit > 0 ? options.limit : 10;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (options?.userId) where.authorId = options.userId;
        if (options?.hasImage) where.NOT = { image_url: null };
        if (options?.tag) {
            where.tags = { contains: options.tag, mode: "insensitive" };
        }
        if (options?.search) {
            where.OR = [
                { title: { contains: options.search, mode: "insensitive" } },
                { content: { contains: options.search, mode: "insensitive" } },
            ];
        }

        const [total, posts] = await Promise.all([
            prisma.post.count({ where }),
            prisma.post.findMany({
                where,
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            avatar_url: true,
                        },
                    },
                    _count: {
                        select: {
                            likes: true,
                            comments: true,
                        },
                    },
                },
                orderBy: { created_at: "desc" },
                skip,
                take: limit,
            }),
        ]);

        const mapped = posts.map((p) => ({
            ...p,
            likesCount: p._count?.likes ?? 0,
            commentsCount: p._count?.comments ?? 0,
        })) as Post[];

        if (options?.sort === "popular") {
            mapped.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
        }

        return { posts: mapped, total, page, limit };
    }

    public async updatePost(
        postId: number,
        data: UpdatePostInput
    ): Promise<Post> {
        const updated = await prisma.post.update({
            where: { id: postId },
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatar_url: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });
        return {
            ...updated,
            likesCount: updated._count?.likes ?? 0,
            commentsCount: updated._count?.comments ?? 0,
        } as Post;
    }

    public async deletePost(postId: number): Promise<Post> {
        const deleted = await prisma.post.delete({
            where: { id: postId },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatar_url: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });
        return {
            ...deleted,
            likesCount: deleted._count?.likes ?? 0,
            commentsCount: deleted._count?.comments ?? 0,
        } as Post;
    }
}

export const postsService = new PostsService();
