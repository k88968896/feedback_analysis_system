import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import Layout from "../components/Layout";
import Table from "../components/Table";
import useStore from "../stores/useStore"; // 引入 Zustand store

const FormList = () => {
    const [forms, setForms] = useState([]);
    const { user } = useStore();

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const res = await API.get("/forms");
            setForms(res.data);
        } catch (error) {
            console.error("Error fetching forms:", error);
        }
    };

    const handleDeleteForm = async (formId) => {
        if (!window.confirm("確定要刪除此表單嗎？")) return;
        try {
            await API.delete(`/forms/${formId}`);
            fetchForms();
        } catch (error) {
            console.error("刪除表單失敗:", error);
        }
    };

    return (
        <Layout>
            <h2>表單列表</h2>
            {user.role === "admin" && <Link to="/forms/add"><button>新增表單</button></Link>}

            <Table
                columns={["標題", "類型", "建立時間"]}
                data={forms.map(form => ({
                    標題: form.form_title,
                    類型: form.form_type === "survey" ? "問卷" : "測驗",
                    建立時間: new Date(form.created_at).toLocaleString()
                }))}
                actions={[
                    { label: "查看詳情", onClick: (form) => window.location.href = `/forms/${form._id}` },
                    { label: "填寫表單", onClick: (form) => window.location.href = `/forms/fill/${form._id}` },
                    ...(user.role === "admin" ? [{ label: "刪除", onClick: (form) => handleDeleteForm(form._id) }] : [])
                ]}
            />
        </Layout>
    );
};

export default FormList;
