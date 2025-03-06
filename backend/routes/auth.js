const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Company = require("../models/Company");
const { verifyToken, authorize } = require("../middleware/authMiddleware");

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
        const { company_code, company_name, department_name, password, role, user_account, user_name, user_phone } = req.body;

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
                company_admin: null,
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

            // 更新公司，將新用戶設置為公司負責人
            await Company.updateOne(
                { _id: newCompany._id },
                { $set: { company_admin: newUser._id } }
            );

        } else if (role === "department_hr") {
            const companyId = await getCompanyIdByCode(company_code); // 根據公司代號獲取公司ID
            if (!companyId) {
                return res.status(400).json({ message: "公司代號錯誤" });
            }

            // 獲取公司實例
            const company = await Company.findOne({ _id: companyId });
            if (!company) {
                return res.status(404).json({ message: "找不到公司" });
            }

            // 檢查該部門是否存在
            const existingDepartment = company.departments.find(d => d.department_name === department_name);

            if (existingDepartment) {
                // 檢查該部門是否已有負責人
                if (existingDepartment.department_hr) {
                    return res.status(400).json({ message: "部門負責人已存在" });
                } else {
                    // 如果沒有負責人，則設置新用戶為部門負責人
                    const newUser = new User({
                        user_account,
                        user_name,
                        user_phone,
                        password: hashedPassword,
                        role: "department_hr",
                        company_id: companyId,
                        department_id: existingDepartment._id // 設置部門ID
                    });
                    await newUser.save();

                    // 更新部門HR為新用戶
                    await Company.updateOne(
                        { _id: companyId, "departments._id": existingDepartment._id },
                        { $set: { "departments.$.department_hr": newUser._id } }
                    );

                    //新增進employees
                    await Company.updateOne(
                        { _id: companyId, "departments._id": existingDepartment._id },
                        { $push: { "departments.$.employees": { user_id: newUser._id } } }
                    );

                    return res.status(201).json({ message: "註冊成功，已設置為部門負責人" });
                }
            } else {
                // 如果部門不存在，創建新部門
                const newDepartment = {
                    department_name,
                    department_hr: null, // 初始時不設置HR
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

                //新增進employees
                await Company.updateOne(
                    { _id: companyId, "departments._id": departmentId },
                    { $push: { "departments.$.employees": { user_id: newUser._id } } }
                );

                return res.status(201).json({ message: "註冊成功，已創建新部門" });
            }

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
router.get("/me", verifyToken, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "未授權" });
        }

        const companies = await Company.find();
        const companyMap = {};
        const departmentMap = {};
        companies.forEach(company => {
            companyMap[company._id.toString()] = company.company_name;
            company.departments.forEach(department => {
                departmentMap[department._id.toString()] = department.department_name;
            });
        });

        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id; // 從 JWT 中提取用戶ID

        // 使用 populate 獲取公司和部門信息
        const user = await User.findById(userId).select("-password"); // 不返回密碼

        if (!user) {
            return res.status(404).json({ message: "用戶不存在" });
        }

        // 構建返回的用戶資料
        const userInfo = {
            _id: user._id,
            user_account: user.user_account,
            user_name: user.user_name,
            user_phone: user.user_phone,
            role: user.role,
            company_name: companyMap[user.company_id?.toString()] || "未指定", // 獲取公司名稱
            department_name: departmentMap[user.department_id?.toString()] || "未指定" // 獲取部門名稱
        };

        res.json(userInfo); // 返回完整的用戶信息
    } catch (error) {
        console.error("獲取用戶信息失敗:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
