import axios from "axios";
import {API_BASE_URL} from "../../configs/apiConfig.js";

const apiClient = axios.create({
    baseURL: API_BASE_URL,

});

apiClient.interceptors.request.use((config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        if (config.data instanceof FormData) {
            // multipart 요청 → Content-Type 제거
            delete config.headers["Content-Type"];
        } else {
            // 일반 JSON 요청
            config.headers["Content-Type"] = "application/json";
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;