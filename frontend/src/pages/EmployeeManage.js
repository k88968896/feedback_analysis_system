import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import "../styles/EmployeeManage.css";

const EmployeeManage = () => {
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newEmployee, setNewEmployee] = useState({ name: "", gender: "男", password: "" });

    // 獲取員工資料
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/employees");
            setEmployees(res.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    // 開啟 Modal
    const openModal = () => {
        console.log("Opening modal..."); // Debugging Log
        setShowModal(true);
    };

    // 關閉 Modal
    const closeModal = () => {
        console.log("Closing modal..."); // Debugging Log
        setShowModal(false);
    };

    // 處理輸入變更
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee((prev) => ({ ...prev, [name]: value }));
    };

    // 保存新員工
    const saveEmployee = async () => {
        try {
            await axios.post("http://localhost:5000/api/employees", newEmployee);
            fetchEmployees(); // 重新加載員工資料
            closeModal(); // 關閉彈窗
        } catch (error) {
            console.error("Error saving employee:", error);
        }
    };

    return (
        <Layout>
            <div className="table-section">
                <div className="table-buttons">
                    <button onClick={openModal}>新增</button>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>員工編號</th>
                                <th>員工姓名</th>
                                <th>性別</th>
                                <th>密碼</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp, index) => (
                                <tr key={index}>
                                    <td>{emp._id}</td>
                                    <td>{emp.name}</td>
                                    <td>{emp.gender}</td>
                                    <td>******</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 新增員工的 Modal */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>新增員工</h2>
                        <form>
                            <div className="form-group">
                                <label>員工姓名:</label>
                                <input type="text" name="name" value={newEmployee.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>性別:</label>
                                <div className="gender-options">
                                    <label>
                                        <input type="radio" name="gender" value="男" checked={newEmployee.gender === "男"} onChange={handleChange} /> 男
                                    </label>
                                    <label>
                                        <input type="radio" name="gender" value="女" checked={newEmployee.gender === "女"} onChange={handleChange} /> 女
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>密碼:</label>
                                <input type="password" name="password" value={newEmployee.password} onChange={handleChange} required />
                            </div>
                            <div className="form-buttons">
                                <button type="button" onClick={saveEmployee}>保存</button>
                                <button type="button" onClick={closeModal}>取消</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default EmployeeManage;
