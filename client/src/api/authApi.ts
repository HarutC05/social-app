import apiClient from "./apiClient";

export interface LoginPayload {
    email: string;
    password: string;
}
export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}
export interface User {
    id: number;
    username: string;
    email: string;
    avatar_url?: string;
    bio?: string;
}

export const login = async (payload: LoginPayload): Promise<User> => {
    const { data } = await apiClient.post("/auth/login", payload);
    return data.data;
};

export const register = async (payload: RegisterPayload): Promise<User> => {
    const { data } = await apiClient.post("/auth/register", payload);
    return data.data;
};

export const logout = async (): Promise<void> => {
    await apiClient.post("/auth/logout");
};

export const getMe = async (): Promise<User | null> => {
    try {
        const { data } = await apiClient.get("/auth/me");
        return data.data;
    } catch (error: any) {
        if (error.response?.status === 401) return null;
        throw error;
    }
};

export const refresh = async (): Promise<User | null> => {
    try {
        const { data } = await apiClient.post("/auth/refresh");
        return data.data;
    } catch (error: any) {
        return null;
    }
};
