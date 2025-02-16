const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    company_name: { type: String, required: true, unique: true },
    departments: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            department_name: { type: String, required: true },
            HR: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // 部門 HR
            employees: [
                {
                    _id: { type: mongoose.Schema.Types.ObjectId, auto:true },
                    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                    position: { type: String, required: true }
                }
            ]
        }
    ]
});

module.exports = mongoose.model("Company", CompanySchema);