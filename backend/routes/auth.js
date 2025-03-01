const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Company = require("../models/Company");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// 獲取公司ID的函數
const getCompanyIdByCode = async (company_code) => {
    const company = await Company.findOne({ company_code });
    return company ? company._id : null; // 如果找到公司，返回其ID，否則返回null
};

// 註冊
router.post("/register", async (req, res) => {
    try {
        const { company_name, user_account, user_name, user_phone, password, role, company_code, department_name } = req.body;

        // 確保帳號唯一
        const existingUser = await User.findOne({ user_account });
        if (existingUser) {
            return res.status(400).json({ message: "帳號已存在" });
        }

        // 加密密碼
        const hashedPassword = await bcrypt.hash(password, 10);

        // 生成唯一的公司代號
        const generateUniqueCompanyCode = async () => {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const numbers = '0123456789';
            let code;
            let isUnique = false;

            while (!isUnique) {
                code = '';
                for (let i = 0; i < 3; i++) {
                    code += letters.charAt(Math.floor(Math.random() * letters.length));
                }
                for (let i = 0; i < 3; i++) {
                    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
                }

                // 檢查代號是否唯一
                const existingCompany = await Company.findOne({ company_code: code });
                isUnique = !existingCompany; // 如果找不到，則是唯一的
            }
            return code;
        };

        // 根據角色創建用戶和公司
        if (role === "company_admin") {
            const uniqueCompanyCode = await generateUniqueCompanyCode(); // 獲取唯一的公司代號
            const newCompany = new Company({
                company_name,
                company_code: uniqueCompanyCode,
                documents: [{ user_account, role }]
            });
            await newCompany.save();

            const newUser = new User({
                user_account,
                user_name,
                user_phone,
                password: hashedPassword,
                role: "company_admin",
                company_id: newCompany._id,
                department_id: null
            });
            await newUser.save();
        } else if (role === "department_hr") {
            const companyId = await getCompanyIdByCode(company_code); // 根據公司代號獲取公司ID
            if (!companyId) {
                return res.status(400).json({ message: "公司代號錯誤" });
            }

            // 創建新的部門
            const newDepartment = {
                department_name,
                HR: null, // 初始時不設置HR
                employees: [] // 初始時部門沒有員工
            };

            // 更新公司，將新部門添加到部門列表中
            await Company.updateOne(
                { _id: companyId },
                { $push: { departments: newDepartment } }
            );

            // 獲取新部門的ID
            const updatedCompany = await Company.findById(companyId);
            const departmentId = updatedCompany.departments[updatedCompany.departments.length - 1]._id;

            // 創建用戶並設置為部門HR
            const newUser = new User({
                user_account,
                user_name,
                user_phone,
                password: hashedPassword,
                role: "department_hr",
                company_id: companyId,
                department_id: departmentId // 設置部門ID
            });
            await newUser.save();

            // 更新部門HR為新用戶
            await Company.updateOne(
                { _id: companyId, "departments._id": departmentId },
                { $set: { "departments.$.department_hr": newUser._id } }
            );

            

        } else if (role === "teacher") {
            const newUser = new User({
                user_account,
                user_name,
                user_phone,
                password: hashedPassword,
                role: "teacher"
            });
            await newUser.save();
        } else if (role === "tester") {
            const newUser = new User({
                user_account,
                user_name,
                user_phone,
                password: hashedPassword,
                role: "tester",
                company_code // 這裡可以根據需要設置
            });
            await newUser.save();
        }

        res.status(201).json({ message: "註冊成功" });
    } catch (error) {
        console.error("註冊失敗:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// 登入
router.post("/login", async (req, res) => {
    try {
        const { company_code, user_account, password } = req.body;

        // 檢查帳號是否存在
        const user = await User.findOne({ user_account });
        if (!user) {
            return res.status(400).json({ message: "帳號或密碼錯誤" });
        }

        // 如果是 admin，則不檢查公司代號
        if (user.role === "admin") {
            // 驗證密碼
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "帳號或密碼錯誤" });
            }
        } else {
            // 檢查用戶所屬公司的代號
            const company = await Company.findOne({ company_code });
            if (!company) {
                return res.status(400).json({ message: "公司代號錯誤" });
            }

            // 驗證密碼
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "帳號或密碼錯誤" });
            }
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
