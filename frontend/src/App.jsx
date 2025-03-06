import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import useStore from "./stores/useStore"; // 引入 Zustand store
import PrivateRoute from "./context/PrivateRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UserList from "./pages/UserList";
import CompanyList from "./pages/CompanyList";
import DepartmentList from "./pages/DepartmentList";
import EmployeeList from "./pages/EmployeeList";
import FormList from "./pages/FormList";
import AddForm from "./pages/AddForm";
import FillForm from "./pages/FillForm";
import Register from "./pages/Register";

const App = () => {
    const { fetchUser } = useStore(); // 使用 Zustand store

    useEffect(() => {
        fetchUser(); // 在組件加載時獲取用戶信息
    }, [fetchUser]);

    return (
        <Router>
            <Routes>
                {/* 未登入 */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 已登入 */}
                <Route path="/" element={<PrivateRoute element={<Home />} />} />
                <Route path="/users" element={
                    <PrivateRoute
                        element={<UserList />}
                        roles={["admin"]}
                    />} />
                <Route path="/companies" element={
                    <PrivateRoute
                        element={<CompanyList />}
                        roles={["admin"]}
                    />} />
                <Route path="/companies/:companyId" element={
                    <PrivateRoute
                        element={<DepartmentList />}
                        roles={["admin", "company_admin"]}
                    />} />
                <Route path="/companies/:companyId/:departmentId/employees" element={
                    <PrivateRoute
                        element={<EmployeeList />}
                        roles={["admin", "company_admin", "department_hr"]}
                    />} />
                <Route path="/forms" element={
                    <PrivateRoute
                        element={<FormList />}
                        roles={["admin", "teacher"]}
                    />} />
                <Route path="/forms/add" element={
                    <PrivateRoute
                        element={<AddForm />}
                        roles={["admin", "teacher"]}
                    />} />
                <Route path="/forms/fill/:formId" element={
                    <PrivateRoute
                        element={<FillForm />}
                        roles={["employee"]}
                    />} />
            </Routes>
        </Router>
    );
};

export default App;
