import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Table from "../components/Table";
import AddModal from "../components/AddModal";
import API from "../utils/api"; // 引入 api.js
import useStore from "../stores/useStore"; // 確保正確導入

const DepartmentList = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const { user } = useStore(); // 使用 Zustand store
    const [departments, setDepartments] = useState([]);
    const [companyName, setCompanyName] = useState("");
    const [newDepartment, setNewDepartment] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        // 確保 user 存在
        if (!user) {
            console.error("用戶未登錄");
            return;
        }

        try {
            console.log("Fetching companyId:", companyId);
            console.log("User role:", user.role);
            console.log("User company_id:", user.company_id);
            let res;
            if (user.role === "admin") {
                res = await API.get(`/companies/${companyId}`);
            } else if (user.role === "company_admin" && user.company_id === companyId) {
                res = await API.get(`/companies/${user.company_id}`);
            } else {
                console.error("無法獲取部門列表");
                return; // 如果角色不符合，直接返回
            }
            setDepartments(res.data.departments);
            setCompanyName(res.data.company_name);
        } catch (error) {
            console.error("獲取部門列表失敗:", error.response ? error.response.data : error);
        }
    };

    const addDepartment = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/companies/${companyId}/departments`, {
                department_name: newDepartment,
            });
            setNewDepartment("");
            fetchDepartments();
            setMessage("部門新增成功！");
            setShowAddModal(false);
        } catch (error) {
            setMessage("新增部門失敗：" + error.response.data.message);
        }
    };

    const handleDeleteDepartment = async (departmentId, employeeCount) => {
        if (employeeCount > 0) {
            alert("無法刪除：該部門仍有員工。請先移除所有員工後再刪除部門。");
            return;
        }

        const confirmDelete = window.confirm("確定要刪除這個部門嗎？");
        if (!confirmDelete) return;

        try {
            await API.delete(`/companies/${companyId}/${departmentId}`);
            fetchDepartments();
        } catch (error) {
            console.error("刪除部門失敗:", error);
        }
    };

    return (
        <Layout>
            <h2>{companyName} - 部門列表</h2>
            <button onClick={() => setShowAddModal(true)}>新增部門</button>
            {message && <p>{message}</p>}

            <Table
                columns={["部門名稱", "負責人", "員工數量"]}
                data={departments.map((dept) => ({
                    _id: dept._id,
                    部門名稱: dept.department_name,
                    負責人: dept.HR || "未設定",
                    員工數量: dept.employees.length
                }))}
                actions={[
                    { label: "查看員工", onClick: (dept) => navigate(`/companies/${companyId}/${dept._id}/employees`) },
                    { label: "刪除", onClick: (dept) => handleDeleteDepartment(dept._id, dept.員工數量) }
                ]}
            />

            {showAddModal && (
                <AddModal
                    title="新增部門"
                    fields={[{ label: "部門名稱", type: "text", value: newDepartment, onChange: (e) => setNewDepartment(e.target.value) }]}
                    onSubmit={addDepartment}
                    onClose={() => setShowAddModal(false)}
                />
            )}
        </Layout>
    );
};

export default DepartmentList;
