import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api"; // 引入 api.js

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await API.get("/auth/me");
            setUser(res.data); // 獲取用戶資訊
        } catch {
            logout();
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
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
