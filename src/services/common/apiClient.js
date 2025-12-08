import axios from "axios";
import {API_BASE_URL} from "../../configs/apiConfig.js";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
});

apiClient.interceptors.request.use((config) => {
        const accesstoken = localStorage.getItem("accessToken");
        if (accesstoken) {
            config.headers.Authorization = `Bearer ${accesstoken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;