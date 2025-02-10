const express = require("express");
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");

const router = express.Router();

// 取得所有員工
router.get("/", async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 新增員工
router.post("/", async (req, res) => {
    try {
        const { name, gender, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = new Employee({ name, gender, password: hashedPassword });
        await newEmployee.save();
        res.status(201).json({ message: "Employee created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
