import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import Table from "../components/Table";

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/companies");
            setCompanies(res.data);
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    return (
        <Layout>
            <h2>公司列表</h2>
            <Table
                columns={["公司名稱"]} // ✅ `_id` 不出現在標題列
                data={companies.map(c => ({ _id: c._id, 公司名稱: c.company_name }))} // ✅ `_id` 存在但不顯示
                actions={[
                    { label: "查看部門", onClick: (c) => navigate(`/departments/${c._id}`) } // ✅ 使用 _id 進行跳轉
                ]}
            />
        </Layout>
    );
};

export default CompanyList;
