const express = require("express");
const mongoose = require("mongoose");
const Company = require("../models/Company");

const router = express.Router();

// 取得所有公司
router.get("/", async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 新增公司
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
router.get("/:companyId", async (req, res) => {
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
router.post("/:companyId/departments", async (req, res) => {
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
                        department_id: departmentId,
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

module.exports = router;
