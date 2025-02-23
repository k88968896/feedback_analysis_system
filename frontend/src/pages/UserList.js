import { useState, useEffect } from "react";
import axios from "axios";
import API from "../utils/api"; // 引入 api.js
import Layout from "../components/Layout";
import Table from "../components/Table";

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await API.get("/users");
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    return (
        <Layout>
            <h2>使用者列表</h2>
            <Table
                columns={["ID", "帳號", "姓名", "電話", "公司", "部門"]}
                data={users.map(user => ({
                    ID: user._id,
                    帳號: user.user_account,
                    姓名: user.user_name,
                    電話: user.user_phone,
                    公司: user.company_name || "未指定",
                    部門: user.department_name || "未指定"
                }))}
            />
        </Layout>
    );
};

export default UserList;
