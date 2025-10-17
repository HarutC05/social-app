import axios, { AxiosError } from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
});

function clearAuthCookies() {
    try {
        document.cookie = "accessToken=; Max-Age=0; path=/";
        document.cookie = "refreshToken=; Max-Age=0; path=/";
    } catch (e) {}
}

let isRefreshing = false;
let failedQueue: {
    resolve: (value?: any) => void;
    reject: (err?: any) => void;
}[] = [];

const processQueue = (error: any) => {
    failedQueue.forEach((p) => {
        if (error) p.reject(error);
        else p.resolve();
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError & { config?: any }) => {
        const originalRequest = error.config;

        if (!originalRequest) return Promise.reject(error);

        const reqUrl = originalRequest.url ?? "";
        if (typeof reqUrl === "string" && reqUrl.includes("/auth/refresh")) {
            clearAuthCookies();
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => apiClient(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await apiClient.post("/auth/refresh");
                processQueue(null);
                return apiClient(originalRequest);
            } catch (err) {
                processQueue(err);
                clearAuthCookies();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
