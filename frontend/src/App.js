import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UserList from "./pages/UserList";
import CompanyList from "./pages/CompanyList";
import DepartmentList from "./pages/DepartmentList";
import EmployeeList from "./pages/EmployeeList";
import FormList from "./pages/FormList";
import AddForm from "./pages/AddForm";
import FillForm from "./pages/FillForm";


const PrivateRoute = ({ element, roles }) => {
    const { user, loading } = useAuth();

    if (loading) return <p>載入中...</p>;
    if (!user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

    return element;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<PrivateRoute element={<Home />} />} />
                    <Route path="/users" element={<PrivateRoute element={<UserList />} roles={["admin"]} />} />
                    <Route path="/companies" element={<PrivateRoute element={<CompanyList />} roles={["admin", "HR"]} />} />
                    <Route path="/departments/:companyId" element={<PrivateRoute element={<DepartmentList />} roles={["admin", "HR"]} />} />
                    <Route path="/employees/:departmentId" element={<PrivateRoute element={<EmployeeList />} roles={["admin", "HR", "employee"]} />} />
                    <Route path="/forms" element={<PrivateRoute element={<FormList />} roles={["admin", "HR", "employee"]} />} />
                    <Route path="/forms/add" element={<PrivateRoute element={<AddForm />} roles={["admin"]} />} />
                    <Route path="/forms/fill/:formId" element={<PrivateRoute element={<FillForm />} roles={["employee"]} />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
