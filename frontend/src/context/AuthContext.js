import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api"; // 引入 api.js

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            // 首先檢查本地存儲中是否有 token
            const token = localStorage.getItem('token');
            
            if (!token) {
                // 如果沒有 token，直接設置 loading 為 false
                setLoading(false);
                return;
            }

            // 只有在有 token 的情況下才發送請求
            const res = await API.get("/auth/me");
            setUser(res.data);
        } catch (error) {
            console.error("Error fetching user:", error);
            // 如果請求失敗，清除本地存儲中的 token
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (company_code, user_account, password) => {
        try {
            const res = await API.post("/auth/login", { company_code, user_account, password }); // 傳遞公司代號
            localStorage.setItem("token", res.data.token);
            await fetchUser(); // 登入後獲取用戶資訊
        } catch (error) {
            console.error("登入失敗:", error.response?.data?.message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
