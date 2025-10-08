import axios, { AxiosError } from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: {
    resolve: (val?: any) => void;
    reject: (err?: any) => void;
}[] = [];

const processQueue = (error: any, tokenUpdated = false) => {
    failedQueue.forEach((p) => {
        if (error) p.reject(error);
        else p.resolve(tokenUpdated);
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError & { config?: any }) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

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
                processQueue(null, true);
                return apiClient(originalRequest);
            } catch (err) {
                processQueue(err, false);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
