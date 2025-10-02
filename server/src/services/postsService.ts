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
}

class PostsService {
    public async createPost(data: CreatePostInput): Promise<Post> {
        try {
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
                },
            });

            return created as Post;
        } catch (error) {
            throw new Error(`Error creating post: ${error}`);
        }
    }

    public async getPostById(postId: number): Promise<Post | null> {
        try {
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
                },
            });

            return post as Post | null;
        } catch (error) {
            throw new Error(`Error fetching post: ${error}`);
        }
    }

    public async getPosts(options?: GetPostsOptions): Promise<Post[]> {
        try {
            const posts = await prisma.post.findMany({
                where: options?.userId ? { authorId: options.userId } : {},
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

            return posts as Post[];
        } catch (error) {
            throw new Error(`Error fetching posts: ${error}`);
        }
    }

    public async updatePost(
        postId: number,
        data: UpdatePostInput
    ): Promise<Post> {
        try {
            const updated = await prisma.post.update({
                where: { id: postId },
                data: data,
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

            return updated as Post;
        } catch (error) {
            throw new Error(`Error updating post: ${error}`);
        }
    }

    public async deletePost(postId: number): Promise<Post> {
        try {
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
                },
            });

            return deleted as Post;
        } catch (error) {
            throw new Error(`Error deleting post: ${error}`);
        }
    }
}

export const postsService = new PostsService();
