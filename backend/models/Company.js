const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    company_name: { type: String, required: true, unique: true },
    company_code: { type: String, required: true, unique: true },
    company_admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },//公司負責人
    departments: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            department_name: { type: String, required: true },
            department_hr: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // 部門 HR
            employees: [
                {
                    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
                }
            ]
        }
    ]
});

module.exports = mongoose.model("Company", CompanySchema);