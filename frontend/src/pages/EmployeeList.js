import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Table from "../components/Table";
import AddModal from "../components/AddModal";
import EditModal from "../components/EditModal";
import API from "../utils/api"; // 引入 api.js
import * as XLSX from 'xlsx';
import "../styles/EmployeeList.css";

const EmployeeList = () => {
    const { departmentId } = useParams();
    const [users, setUsers] = useState([]);
    const [currentDepartmentName, setCurrentDepartmentName] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [newUser, setNewUser] = useState({
        user_id: "",
        user_account: "",
        user_name: "",
        user_phone: "",
        password: "",
    });
    const fileInputRef = useRef(null);
    const [importedData, setImportedData] = useState([]);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editableData, setEditableData] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await API.get(`/departments/${departmentId}/employees`);
            setUsers(res.data.employees);
            setCurrentDepartmentName(res.data.department_name);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await API.post("/employees", {
                ...newUser,
                department_id: departmentId,
            });
            fetchUsers();
            setShowAddModal(false);
        } catch (error) {
            console.error("新增用戶失敗:", error);
        }
    };

    const handleEditUser = async (e) => {
        e.preventDefault();

        if (!userToEdit?._id) {
            console.error("錯誤: userId 為空");
            return;
        }

        try {
            const res = await API.put(`/employees/${userToEdit._id}`, {
                user_account: userToEdit.user_account,
                user_name: userToEdit.user_name,
                user_phone: userToEdit.user_phone,
                user_password: userToEdit.user_password,
            });

            console.log("更新成功:", res.data);
            fetchUsers();
            setShowEditModal(false);
        } catch (error) {
            console.error("修改用戶資訊失敗:", error.response ? error.response.data : error);
        }
    };

    const handleDeleteUser = async (e) => {
        const confirmDelete = window.confirm("確定要刪除這位用戶嗎？");
        if (!confirmDelete) return;

        try {
            await API.delete(`/employees/${e}`);
            fetchUsers();
        } catch (error) {
            console.error("刪除用戶失敗:", error);
        }
    };

    const handleImportExcel = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // 使用 header: 1 來獲取原始數據

            // 限制只讀取每行的前四列並映射到相應的屬性
            const limitedData = jsonData.slice(1).map(row => { // 跳過標題行
                return {
                    user_account: row[0], // 第1列: 帳號
                    user_name: row[1],    // 第2列: 姓名
                    user_phone: row[2],   // 第3列: 電話
                    password: row[3],     // 第4列: 密碼
                };
            });

            setEditableData(limitedData);
            setShowImportModal(true);
        };

        reader.readAsArrayBuffer(file);
    };

    const handleSaveChanges = async () => {
        // 檢查帳號是否重複
        const accounts = editableData.map(row => row.user_account);
        const uniqueAccounts = new Set(accounts);
        if (uniqueAccounts.size !== accounts.length) {
            console.error("錯誤: 帳號不得重複");
            return;
        }

        // 檢查是否有空值
        for (const row of editableData) {
            if (!row.user_account || !row.user_name || !row.user_phone || !row.password) {
                alert("錯誤: 所有欄位都必須填寫！");
                return;
            }
        }
        console.log(editableData);

        try {
            const usersWithDepartmentId = editableData.map(row => ({
                ...row,
                department_id: departmentId, // 添加 department_id
            }));
            await API.post('/employees/bulk', usersWithDepartmentId);
            console.log("用戶資料已保存");
            setShowImportModal(false);
            fetchUsers();
        } catch (error) {
            console.error("保存變更失敗:", error);
        }
    };

    return (
        <Layout>
            <h2>{currentDepartmentName} - 用戶列表</h2>
            <button onClick={() => setShowAddModal(true)}>新增用戶</button>
            <input
                type="file"
                accept=".xlsx, .xls"
                style={{ display: 'none' }} // 隱藏文件輸入
                onChange={handleImportExcel}
                ref={fileInputRef} // 使用 ref 來引用文件輸入
            />
            <button onClick={() => fileInputRef.current.click()}>匯入用戶</button>

            <Table
                columns={["ID", "帳號", "姓名", "電話"]}
                data={users.map(user => ({
                    _id: user._id,
                    ID: user._id,
                    帳號: user.user_account,
                    姓名: user.user_name,
                    電話: user.user_phone,
                }))}
                actions={[
                    { label: "編輯", onClick: (user) => { console.log("Editing User:", user._id); setUserToEdit(user); setShowEditModal(true); } },
                    { label: "刪除", onClick: (user) => handleDeleteUser(user._id) }
                ]}
            />

            {/* 顯示上傳資料的模態框 */}
            {showImportModal && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between align-items-center">
                                <h5 className="modal-title">上傳用戶資料</h5>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={() => {
                                        setEditableData([...editableData, { user_account: "", user_name: "", user_phone: "", password: "" }]);
                                    }}
                                >
                                    新增
                                </button>
                                <button type="button" className="close" onClick={() => setShowImportModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>帳號</th>
                                            <th>姓名</th>
                                            <th>電話</th>
                                            <th>密碼</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {editableData.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {Object.keys(row).map((key, colIndex) => (
                                                    <td key={colIndex}>
                                                        <input
                                                            type="text"
                                                            value={row[key]}
                                                            onChange={(e) => {
                                                                const newData = [...editableData];
                                                                newData[rowIndex][key] = e.target.value;
                                                                setEditableData(newData);
                                                            }}
                                                        />
                                                    </td>
                                                ))}
                                                <td>
                                                    <button 
                                                        className="btn btn-danger" 
                                                        onClick={() => {
                                                            const newData = editableData.filter((_, index) => index !== rowIndex);
                                                            setEditableData(newData);
                                                        }}
                                                    >
                                                        X
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowImportModal(false)}>關閉</button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>保存變更</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 統一的新增用戶彈窗 */}
            {showAddModal && (
                <AddModal
                    title="新增用戶"
                    fields={[
                        { label: "帳號", type: "text", name: "user_account", value: newUser.user_account },
                        { label: "姓名", type: "text", name: "user_name", value: newUser.user_name },
                        { label: "電話", type: "text", name: "user_phone", value: newUser.user_phone },
                        { label: "密碼", type: "password", name: "password", value: newUser.password },
                    ]}
                    onChange={(e) => setNewUser({ ...newUser, [e.target.name]: e.target.value })}
                    onSubmit={handleAddUser}
                    onClose={() => setShowAddModal(false)}
                />
            )}

            {/* 統一的編輯用戶彈窗 */}
            {showEditModal && userToEdit && (
                <EditModal
                    title="編輯用戶"
                    fields={[
                        { label: "帳號", type: "text", name: "user_account", value: userToEdit.user_account },
                        { label: "姓名", type: "text", name: "user_name", value: userToEdit.user_name },
                        { label: "電話", type: "text", name: "user_phone", value: userToEdit.user_phone },
                        { label: "密碼", type: "password", name: "password", value: userToEdit.password },
                    ]}
                    onChange={(e) => setUserToEdit({ ...userToEdit, [e.target.name]: e.target.value })}
                    onSubmit={handleEditUser}
                    onClose={() => { setShowEditModal(false); setUserToEdit({}); }}
                />
            )}
        </Layout>
    );
};

export default EmployeeList;
