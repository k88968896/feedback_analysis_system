const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const Company = require("../models/Company");

const router = express.Router();

// 新增員工
router.post("/", async (req, res) => {
    try {
        const { user_account, user_name, user_phone, password, department_id } = req.body;

        // 確保 `department_id` 是有效的 ObjectId
        if (!mongoose.Types.ObjectId.isValid(department_id)) {
            return res.status(400).json({ message: "無效的 department_id" });
        }

        // 檢查 `department_id` 是否存在於 `companies` 集合
        const company = await Company.findOne({ "departments._id": department_id });
        if (!company) {
            return res.status(404).json({ message: "找不到部門，請確認 department_id 是否正確" });
        }

        // 確保 `user_account` 唯一
        const existingUser = await User.findOne({ user_account });
        if (existingUser) {
            return res.status(400).json({ message: "該帳號已存在" });
        }

        // 密碼加密
        const hashedPassword = await bcrypt.hash(password, 10);

        // 新增員工到 `users` 集合
        const newUser = new User({
            user_account,
            user_name,
            user_phone,
            user_identity_group: "employee",
            department_id: department_id,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // 更新 `companies` 集合，將員工加入對應的 `department`
        const companyUpdate = await Company.updateOne(
            { "departments._id": department_id },
            {
                $push: {
                    "departments.$.employees": {
                        user_id: savedUser._id,
                        position: "一般員工"
                    }
                }
            }
        );

        if (companyUpdate.modifiedCount === 0) {
            return res.status(404).json({ message: "部門未找到，請確認 department_id 是否正確" });
        }

        res.status(201).json({ message: "員工新增成功", user: savedUser });
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 批量新增員工
router.post('/bulk', async (req, res) => {
    try {
        const users = req.body; // 獲取請求中的用戶資料

        // 確保 users 是一個數組
        if (!Array.isArray(users)) {
            return res.status(400).json({ message: "請求資料格式不正確，應為數組" });
        }

        // 檢查每個用戶的資料
        for (const user of users) {
            const { user_account, user_name, user_phone, password, department_id } = user;

            // 確保帳號唯一
            const existingUser = await User.findOne({ user_account });
            if (existingUser) {
                return res.status(400).json({ message: `帳號 ${user_account} 已存在` });
            }

            // 確保 `department_id` 是有效的 ObjectId
            if (!mongoose.Types.ObjectId.isValid(department_id)) {
                return res.status(400).json({ message: "無效的 department_id" });
            }

            // 密碼加密
            const hashedPassword = await bcrypt.hash(password, 10);

            // 新增員工到 `users` 集合
            const newUser = new User({
                user_account,
                user_name,
                user_phone,
                password: hashedPassword,
                department_id,
            });

            const savedUser = await newUser.save();

            // 更新 `companies` 集合，將員工加入對應的 `department`
            await Company.updateOne(
                { "departments._id": department_id },
                {
                    $push: {
                        "departments.$.employees": {
                            user_id: savedUser._id,
                            position: "一般員工"
                        }
                    }
                }
            );


        }

        res.status(201).json({ message: "員工批量新增成功" });
    } catch (error) {
        console.error("Error adding employees:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 修改員工資訊
router.put("/:employeeId", async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { user_account, user_name, user_phone, password } = req.body;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: "無效的 employeeId" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            employeeId,
            { user_account, user_name, user_phone, password },
            { new: true } // 返回更新後的資料
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "找不到員工" });
        }

        res.json({ message: "員工資訊更新成功", user: updatedUser });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 刪除員工
router.delete("/:employeeId", async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: "無效的 employeeId" });
        }

        // 找到員工
        const employee = await User.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "找不到員工" });
        }

        // 從 `users` 集合刪除
        await User.findByIdAndDelete(employeeId);

        // 從 `companies` 集合內部門的 `employees` 陣列中移除
        const result = await Company.updateOne(
            { "departments.employees.user_id": employeeId }, // 使用 user_id 查詢
            { $pull: { "departments.$.employees": { user_id: employeeId } } } // 使用 user_id 移除
        );

        if (result.modifiedCount === 0) {
            console.log("No employees were removed from the company.");
            return res.status(404).json({ message: "未找到相關部門或員工" });
        }

        res.json({ message: "員工已刪除" });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



module.exports = router;
