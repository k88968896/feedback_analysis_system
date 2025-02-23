import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

// 確保 `JWT Token` 被加入 `Authorization` Header
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
