import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from "./context/AuthContext";
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
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* 未登入 */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* 已登入 */}
                    <Route path="/" element={
                        <PrivateRoute
                            element={<Home />}
                        />} />
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
                    <Route path="/departments/:companyId" element={
                        <PrivateRoute
                            element={<DepartmentList />}
                            roles={["admin", "company_admin"]}
                        />} />
                    <Route path="/employees/:departmentId" element={
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
        </AuthProvider>
    );
};

export default App;
