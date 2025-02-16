import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ user_account: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.user_account, formData.password);
            navigate("/"); // 
        } catch (err) {
            setError("登入失敗，請檢查帳號與密碼");
        }
    };

    return (
        <div className="login-container">
            <h2>登入</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="user_account" placeholder="帳號" onChange={handleChange} required />
                <input type="password" name="password" placeholder="密碼" onChange={handleChange} required />
                <button type="submit">登入</button>
            </form>
        </div>
    );
};

export default Login;
