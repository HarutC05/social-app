import apiClient from "./apiClient";

export interface User {
    id: number;
    username: string;
    email?: string;
    bio?: string | null;
    avatar_url?: string | null;
}

export const getUserById = async (id: number): Promise<User> => {
    const { data } = await apiClient.get(`/users/${id}`);
    return data.data as User;
};

export const getUsersCount = async (): Promise<{ total: number }> => {
    const { data } = await apiClient.get("/users?count=true");
    return { total: data.meta?.total ?? data.data?.length ?? 0 };
};

export const updateUser = async (id: number, payload: Partial<User>) => {
    const { data } = await apiClient.patch(`/users/${id}`, payload);
    return data.data as User;
};

export const uploadAvatar = async (
    id: number,
    file: File
): Promise<{ avatar_url: string }> => {
    const form = new FormData();
    form.append("avatar", file);
    const { data } = await apiClient.post(`/users/${id}/avatar`, form, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data as { avatar_url: string };
};

export const updatePassword = async (
    id: number,
    currentPassword: string,
    newPassword: string
) => {
    const { data } = await apiClient.post(`/users/${id}/password`, {
        currentPassword,
        newPassword,
    });
    return data;
};
