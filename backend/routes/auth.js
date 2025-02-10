const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// 註冊新員工
router.post("/register", [
    body("companyCode").notEmpty().withMessage("Company code is required"),
    body("employeeCode").notEmpty().withMessage("Employee code is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { companyCode, employeeCode, password } = req.body;
        const existingUser = await User.findOne({ employeeCode });
        if (existingUser) return res.status(400).json({ message: "Employee already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ companyCode, employeeCode, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "Employee registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 員工登入
router.post("/login", async (req, res) => {
    try {
        const { employeeCode, password } = req.body;
        const user = await User.findOne({ employeeCode });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, employeeCode: user.employeeCode });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
