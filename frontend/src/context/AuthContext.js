import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const login = async (employeeCode, password) => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { employeeCode, password });
            localStorage.setItem("user", JSON.stringify(res.data));
            setUser(res.data);
        } catch (error) {
            console.error(error.response.data.message);
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
