import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api"; // 引入 API 工具
import Layout from "../components/Layout";
import "../styles/Register.css"; // 引入自定義樣式

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company_name: "",
        user_account: "",
        user_name: "",
        user_phone: "",
        password: "",
        company_code: "", // 新增公司代號字段
        role: "" // 新增角色字段
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (role) => {
        setFormData({ ...formData, role }); // 更新角色
        setError(""); // 清除錯誤消息
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 檢查是否選擇角色
        if (!formData.role) {
            setError("請選擇註冊身份");
            return;
        }
        try {
            await API.post("/auth/register", formData); // 假設後端有註冊的 API
            navigate("/login"); // 註冊成功後重定向到登入頁面
        } catch (err) {
            setError("註冊失敗，請檢查輸入的資料");
        }
    };

    return (
        <Layout isSidebarOpen={false}>
            <div className="register-container">
                <h2>註冊</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="role-selection">
                        <button 
                            type="button" 
                            className={formData.role === "company_admin" ? "active" : ""} 
                            onClick={() => handleRoleChange("company_admin")}
                        >
                            公司負責人
                        </button>
                        <button 
                            type="button" 
                            className={formData.role === "department_hr" ? "active" : ""} 
                            onClick={() => handleRoleChange("department_hr")}
                        >
                            部門HR
                        </button>
                        <button 
                            type="button" 
                            className={formData.role === "teacher" ? "active" : ""} 
                            onClick={() => handleRoleChange("teacher")}
                        >
                            教師
                        </button>
                        {/* <button 
                            type="button" 
                            className={formData.role === "tester" ? "active" : ""} 
                            onClick={() => handleRoleChange("tester")}
                        >
                            測驗者
                        </button> */}
                    </div>

                    {/* 根據選擇的角色顯示相應的輸入框 */}
                    {formData.role === "company_admin" && (
                        <>
                            <input type="text" name="company_name" placeholder="公司名稱" onChange={handleChange} required />
                            <input type="text" name="user_account" placeholder="帳號" onChange={handleChange} required />
                            <input type="text" name="user_name" placeholder="用戶名稱" onChange={handleChange} required />
                            <input type="text" name="user_phone" placeholder="用戶電話" onChange={handleChange} required />
                            <input type="password" name="password" placeholder="密碼" onChange={handleChange} required />
                        </>
                    )}
                    {formData.role === "department_hr" && (
                        <>
                            <input type="text" name="company_code" placeholder="公司代號" onChange={handleChange} required />
                            <input type="text" name="department_name" placeholder="部門名稱" onChange={handleChange} required />
                            <input type="text" name="user_account" placeholder="帳號" onChange={handleChange} required />
                            <input type="text" name="user_name" placeholder="用戶名稱" onChange={handleChange} required />
                            <input type="text" name="user_phone" placeholder="用戶電話" onChange={handleChange} required />
                            <input type="password" name="password" placeholder="密碼" onChange={handleChange} required />
                        </>
                    )}
                    {formData.role === "teacher" && (
                        <>
                            <input type="text" name="user_account" placeholder="帳號" onChange={handleChange} required />
                            <input type="text" name="user_name" placeholder="用戶名稱" onChange={handleChange} required />
                            <input type="text" name="user_phone" placeholder="用戶電話" onChange={handleChange} required />
                            <input type="password" name="password" placeholder="密碼" onChange={handleChange} required />
                        </>
                    )}
                    {formData.role === "tester" && (
                        <>
                            <input type="text" name="company_code" placeholder="公司代號" onChange={handleChange} required />
                            <input type="text" name="user_account" placeholder="帳號" onChange={handleChange} required />
                            <input type="text" name="user_name" placeholder="用戶名稱" onChange={handleChange} required />
                            <input type="text" name="user_phone" placeholder="用戶電話" onChange={handleChange} required />
                            <input type="password" name="password" placeholder="密碼" onChange={handleChange} required />
                        </>
                    )}

                    <button type="submit">註冊</button>
                </form>
            </div>
        </Layout>
    );
};

export default Register; 