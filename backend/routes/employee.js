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
        const company = await Company.findOne({ "departments.department_id": department_id });
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
            department_id: new mongoose.Types.ObjectId(department_id),
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // 更新 `companies` 集合，將員工加入對應的 `department`
        const companyUpdate = await Company.updateOne(
            { "departments.department_id": department_id },
            {
                $push: {
                    "departments.$.employees": {
                        employee_id: savedUser._id,
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
            { user_account, user_name, user_phone, password},
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
        await Company.updateOne(
            { "departments.employees.employee_id": employeeId },
            { $pull: { "departments.$.employees": { employee_id: employeeId } } }
        );

        res.json({ message: "員工已刪除" });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
