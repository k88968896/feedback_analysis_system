import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api"; // 引入 api.js

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/auth/me")
            .then((res) => setUser(res.data))
            .catch(() => logout());
        setLoading(false);
    }, []);

    const login = async (user_account, password) => {
        try {
            const res = await API.post("/auth/login", { user_account, password });
            localStorage.setItem("token", res.data.token);
            setUser(res.data);
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
