import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import "../styles/Login.css"; // 引入自定義樣式

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ company_code: "", user_account: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 確保傳遞所有必要的資料
            await login(formData.company_code, formData.user_account, formData.password);
            navigate("/");
        } catch (err) {
            setError("登入失敗，請檢查公司代號、帳號與密碼");
        }
    };

    return (
        <Layout isSidebarOpen={false}>
            <div className="login-container">
                <h2>登入</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} className="login-form">

                    {formData.user_account !== "admin" &&
                        <input type="text" name="company_code" placeholder="公司代號" onChange={handleChange} required />
                    }
                    <input type="text" name="user_account" placeholder="帳號" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="密碼" onChange={handleChange} required />
                    <button type="submit">登入</button>
                    <button onClick={() => navigate("/register")}>註冊</button>
                </form>
            </div>
        </Layout>
    );
};

export default Login;
