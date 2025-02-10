import Layout from "../components/Layout";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
    const [companyCode, setCompanyCode] = useState("");
    const [employeeCode, setEmployeeCode] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(employeeCode, password);
        navigate("/");
    };

    return (
        <Layout>
            <h2>登入</h2>
            <form onSubmit={handleSubmit}>
                <p>
                    <label>公司代碼</label>
                    <input type="text" value={companyCode} onChange={(e) => setCompanyCode(e.target.value)} required />
                </p>
                <p>
                    <label>員工代碼</label>
                    <input type="text" value={employeeCode} onChange={(e) => setEmployeeCode(e.target.value)} required />
                </p>
                <p>
                    <label>密碼</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </p>
                <button type="submit">登入</button>
            </form>
        </Layout>
    );
};

export default Login;