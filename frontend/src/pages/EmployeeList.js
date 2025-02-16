import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import Table from "../components/Table";
import AddModal from "../components/AddModal";
import EditModal from "../components/EditModal";

const EmployeeList = () => {
    const { departmentId } = useParams();
    const [employees, setEmployees] = useState([]);
    const [departmentName, setDepartmentName] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);
    const [newEmployee, setNewEmployee] = useState({
        user_account: "",
        user_name: "",
        user_phone: "",
        password: "",
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/departments/${departmentId}/employees`);
            setEmployees(res.data.employees);
            setDepartmentName(res.data.department_name);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/employees", {
                ...newEmployee,
                department_id: departmentId,
            });
            fetchEmployees();
            setShowAddModal(false);
        } catch (error) {
            console.error("新增員工失敗:", error);
        }
    };

    const handleEditEmployee = async (e) => {
        e.preventDefault();
    
        if (!editEmployee?._id) {
            console.error("錯誤: employeeId 為空");
            return;
        }
    
        try {
            const res = await axios.put(`http://localhost:5000/api/employees/${editEmployee._id}`, {
                user_account: editEmployee.user_account,
                user_name: editEmployee.user_name,
                user_phone: editEmployee.user_phone,
                user_password: editEmployee.user_password,
            });
    
            console.log("更新成功:", res.data);
            fetchEmployees();
            setShowEditModal(false);
        } catch (error) {
            console.error("修改員工資訊失敗:", error.response ? error.response.data : error);
        }
    };

    const handleDeleteEmployee = async (employeeId) => {
        const confirmDelete = window.confirm("確定要刪除這位員工嗎？");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/employees/${employeeId}`);
            fetchEmployees();
        } catch (error) {
            console.error("刪除員工失敗:", error);
        }
    };
    


    return (
        <Layout>
            <h2>{departmentName} - 員工列表</h2>
            <button onClick={() => setShowAddModal(true)}>新增員工</button>

            <Table
                columns={["帳號", "姓名", "電話"]}
                data={employees.map(emp => ({
                    _id: emp._id,
                    帳號: emp.user_account,
                    姓名: emp.user_name,
                    電話: emp.user_phone,
                }))}
                actions={[
                    { label: "編輯", onClick: (emp) => { console.log("Editing User:", emp._id); setEditEmployee(emp); setShowEditModal(true); } },
                    { label: "刪除", onClick: (emp) => handleDeleteEmployee(emp._id)}
                ]}
            />

            {/* 統一的新增員工彈窗 */}
            {showAddModal && (
                <AddModal
                    title="新增員工"
                    fields={[
                        { label: "帳號", type: "text", name: "user_account", value: newEmployee.user_account },
                        { label: "姓名", type: "text", name: "user_name", value: newEmployee.user_name },
                        { label: "電話", type: "text", name: "user_phone", value: newEmployee.user_phone },
                        { label: "密碼", type: "password", name: "password", value: newEmployee.password },
                    ]}
                    onChange={(e) => setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value })}
                    onSubmit={handleAddEmployee}
                    onClose={() => setShowAddModal(false)}
                />
            )}

            {/* 統一的編輯員工彈窗 */}
            {showEditModal && editEmployee && (
                <EditModal
                    title="編輯員工"
                    fields={[
                        { label: "帳號", type: "text", name: "user_account", value: editEmployee.user_account },
                        { label: "姓名", type: "text", name: "user_name", value: editEmployee.user_name },
                        { label: "電話", type: "text", name: "user_phone", value: editEmployee.user_phone },
                        { label: "密碼", type: "password", name: "password", value: editEmployee.password },
                    ]}
                    onChange={(e) => setEditEmployee({ ...editEmployee, [e.target.name]: e.target.value })}
                    onSubmit={handleEditEmployee}
                    onClose={() => setShowEditModal(false)}
                />
            )}
        </Layout>
    );
};

export default EmployeeList;
