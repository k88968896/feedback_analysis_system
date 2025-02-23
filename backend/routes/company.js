const express = require("express");
const mongoose = require("mongoose");
const Company = require("../models/Company");
const { verifyToken, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// 取得所有公司
router.get("/", verifyToken, async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 新增公司 尚未新增權限
//router.post("/", verifyToken, authorize(["admin"]), async (req, res) => {
router.post("/", async (req, res) => {
    try {
        const { company_name } = req.body;

        const existingCompany = await Company.findOne({ company_name });
        if (existingCompany) {
            return res.status(400).json({ message: "公司已存在" });
        }

        const newCompany = new Company({ company_name, departments: [] });
        await newCompany.save();

        res.status(201).json({ message: "公司新增成功", company: newCompany });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 取得公司內所有部門
router.get("/:companyId", verifyToken, authorize(["admin", "HR"]), async (req, res) => {
    try {
        const { companyId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: "無效的 companyId" });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "找不到公司" });
        }

        res.json({ company_name: company.company_name, departments: company.departments });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 新增部門到公司
router.post("/:companyId/departments", verifyToken, authorize(["admin", "HR"]), async (req, res) => {
    try {
        const { companyId } = req.params;
        const { department_name } = req.body;

        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: "無效的 companyId" });
        }

        const departmentId = new mongoose.Types.ObjectId();

        const company = await Company.findByIdAndUpdate(
            companyId,
            {
                $push: {
                    departments: {
                        _id: departmentId,
                        department_name,
                        HR: null,
                        employees: []
                    }
                }
            },
            { new: true }
        );

        if (!company) {
            return res.status(404).json({ message: "找不到公司" });
        }

        res.status(201).json({ message: "部門新增成功", department_id: departmentId });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 刪除部門
router.delete("/:companyId/departments/:departmentId", verifyToken, authorize(["admin", "HR"]), async (req, res) => {
    try {
        const { companyId, departmentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(companyId) || !mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json({ message: "無效的 companyId 或 departmentId" });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "找不到公司" });
        }

        // 檢查部門是否有員工
        const department = company.departments.find(d => d._id.toString() === departmentId);
        if (!department) {
            return res.status(404).json({ message: "找不到部門" });
        }
        if (department.employees.length > 0) {
            return res.status(400).json({ message: "無法刪除：該部門仍有員工" });
        }

        // 刪除部門
        await Company.updateOne(
            { _id: companyId },
            { $pull: { departments: { _id: departmentId } } }
        );

        res.json({ message: "部門已刪除" });
    } catch (error) {
        console.error("Error deleting department:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
