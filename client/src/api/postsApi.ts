import apiClient from "./apiClient";

export interface Author {
    id: number;
    username: string;
    email: string;
    avatar_url?: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    image_url?: string;
    tags?: string[];
    authorId: number;
    author?: Author;
    likesCount?: number;
    commentsCount?: number;
    created_at: string;
    updated_at?: string;
}

export const createPost = async (post: Partial<Post>): Promise<Post> => {
    const { data } = await apiClient.post("/posts", post);
    return data.data;
};

export const getPosts = async (
    page = 1,
    limit = 10,
    userId?: number
): Promise<{
    data: Post[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}> => {
    const params: Record<string, any> = { page, limit };
    if (userId) params.userId = userId;
    const { data } = await apiClient.get("/posts", { params });
    return { data: data.data as Post[], meta: data.meta };
};

export const getPostById = async (id: number): Promise<Post> => {
    const { data } = await apiClient.get(`/posts/${id}`);
    return data.data;
};

export const updatePost = async (
    id: number,
    post: Partial<Post>
): Promise<Post> => {
    const { data } = await apiClient.patch(`/posts/${id}`, post);
    return data.data;
};

export const deletePost = async (id: number): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
};
