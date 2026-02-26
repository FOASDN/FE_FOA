import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4004/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // IMPORTANT: send cookies with every request (httpOnly auth cookies)
    withCredentials: true,
});

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await apiClient.get('/auth/refresh');
                return apiClient(originalRequest);
            } catch {
                // Refresh failed — redirect to login
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
