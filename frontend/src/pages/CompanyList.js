import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import Table from "../components/Table";
import API from "../utils/api"; // 引入 api.js
import AddModal from "../components/AddModal"; // 引入新增模態框組件

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false); // 控制新增模態框顯示
    const [newCompanyName, setNewCompanyName] = useState(""); // 新公司的名稱
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await API.get("/companies");
            setCompanies(res.data);
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    const addCompany = async (e) => {
        e.preventDefault();
        try {
            await API.post("/companies", { company_name: newCompanyName });
            setNewCompanyName(""); // 清空輸入框
            fetchCompanies(); // 重新獲取公司列表
            setShowAddModal(false); // 關閉模態框
        } catch (error) {
            console.error("新增公司失敗:", error);
        }
    };

    return (
        <Layout>
            <h2>公司列表</h2>
            <button onClick={() => setShowAddModal(true)}>新增公司</button> {/* 新增公司按鈕 */}
            <Table
                columns={["公司名稱", "公司代號"]} // 新增公司代號列
                data={companies.map(c => ({ _id: c._id, 公司名稱: c.company_name, 公司代號: c.company_code }))} // 包含公司代號
                actions={[
                    { label: "查看部門", onClick: (c) => navigate(`/companies/${c._id}`) } // 使用 _id 進行跳轉
                ]}
            />

            {/* 顯示新增公司的模態框 */}
            {showAddModal && (
                <AddModal
                    title="新增公司"
                    fields={[
                        { label: "公司名稱", type: "text", value: newCompanyName, onChange: (e) => setNewCompanyName(e.target.value) }
                    ]}
                    onSubmit={addCompany}
                    onClose={() => setShowAddModal(false)}
                />
            )}
        </Layout>
    );
};

export default CompanyList;
