import apiClient from "./apiClient";

export interface Comment {
    id: number;
    postId: number;
    authorId: number;
    authorUsername?: string;
    authorAvatar?: string;
    content: string;
    created_at: string;
    author?: {
        id: number;
        username: string;
        avatar_url?: string | null;
    } | null;
}

export const getCommentsByPost = async (postId: number): Promise<Comment[]> => {
    const { data } = await apiClient.get(`/posts/${postId}/comments`);
    return data.data as Comment[];
};

export const createComment = async (
    postId: number,
    content: string
): Promise<Comment> => {
    const { data } = await apiClient.post(`/posts/${postId}/comments`, {
        content,
    });
    return data.data as Comment;
};
