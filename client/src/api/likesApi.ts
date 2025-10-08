import apiClient from "./apiClient";

export const likePost = async (postId: number) => {
    const { data } = await apiClient.post(`/posts/${postId}/likes`);
    return data;
};

export const unlikePost = async (postId: number) => {
    const { data } = await apiClient.delete(`/posts/${postId}/likes`);
    return data;
};
