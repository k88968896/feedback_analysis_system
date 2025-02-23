const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Company = require("../models/Company");
const { verifyToken, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// 取得所有使用者，包含公司與部門名稱
router.get("/", verifyToken, authorize(["admin"]), async (req, res) => {
    try {
        // 查詢所有使用者
        const users = await User.find();

        // 查詢所有公司，並建立 ID 與名稱的對應
        const companies = await Company.find();
        const companyMap = {};
        companies.forEach(company => {
            company.departments.forEach(department => {
                companyMap[department._id.toString()] = {
                    company_name: company.company_name,
                    department_name: department.department_name
                };
            });
        });

        // 將 `company_name` 和 `department_name` 加入使用者資料
        const usersWithCompanyInfo = users.map(user => ({
            _id: user._id,
            user_account: user.user_account,
            user_name: user.user_name,
            user_phone: user.user_phone,
            company_name: companyMap[user.department_id?.toString()]?.company_name || "未指定",
            department_name: companyMap[user.department_id?.toString()]?.department_name || "未指定"
        }));

        res.json(usersWithCompanyInfo);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
