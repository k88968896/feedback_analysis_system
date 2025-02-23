const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// 驗證 `JWT`，解析用戶資訊
const verifyToken = async (req, res, next) => {
    try {
        console.log("收到的 Authorization Header:", req.headers.authorization);
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "未授權，請提供 Token" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password"); // 移除密碼字段
        if (!req.user) {
            return res.status(401).json({ message: "無效的 Token" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Token 驗證失敗，請重新登入" });
    }
};

// 限制 API 訪問權限
const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "權限不足，禁止訪問" });
        }
        next();
    };
};

module.exports = { verifyToken, authorize };
