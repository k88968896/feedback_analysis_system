const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Company = require("../models/Company");

const router = express.Router();

// 取得部門內所有員工
router.get("/:departmentId/employees", async (req, res) => {
    try {
        const { departmentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json({ message: "無效的 departmentId" });
        }

        const company = await Company.findOne({ "departments._id": departmentId });
        if (!company) {
            return res.status(404).json({ message: "找不到部門" });
        }

        const department = company.departments.find(d => d._id.toString() === departmentId);
        if (!department) {
            return res.status(404).json({ message: "部門不存在" });
        }

        // 找出所有屬於該部門的員工
        const employees = await User.find({ department_id: departmentId });

        res.json({ department_name: department.department_name, employees });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
