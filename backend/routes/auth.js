const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// 註冊
router.post("/register", async (req, res) => {
    try {
        const { user_account, user_name, user_phone, password, role, department_id } = req.body;

        // 確保帳號唯一
        const existingUser = await User.findOne({ user_account });
        if (existingUser) {
            return res.status(400).json({ message: "帳號已存在" });
        }

        // 加密密碼
        const hashedPassword = await bcrypt.hash(password, 10);

        // 創建新用戶
        const newUser = new User({
            user_account,
            user_name,
            user_phone,
            password: hashedPassword,
            role,
            department_id
        });

        await newUser.save();
        res.status(201).json({ message: "註冊成功" });
    } catch (error) {
        console.error("註冊失敗:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// 登入
router.post("/login", async (req, res) => {
    try {
        const { user_account, password } = req.body;

        // 檢查帳號是否存在
        const user = await User.findOne({ user_account });
        if (!user) {
            return res.status(400).json({ message: "帳號或密碼錯誤" });
        }

        // 驗證密碼
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "帳號或密碼錯誤" });
        }

        // 簽發 JWT
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "登入成功", token, role: user.role });
    } catch (error) {
        console.error("登入失敗:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// 驗證登入並獲取當前用戶資訊
router.get("/me", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "未授權" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "用戶不存在" });
        }

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: "無效的 Token" });
    }
});

module.exports = router;
