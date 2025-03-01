const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    user_account: { type: String, required: true, unique: true },
    user_name: { type: String, required: true },
    user_phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: ["admin", "teacher", "company_admin", "department_hr", "tester"],
        default: "tester"
    },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    department_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: false },
});

module.exports = mongoose.model("User", UserSchema);