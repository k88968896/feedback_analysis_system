const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    user_account: { type: String, required: true, unique: true },
    user_name: { type: String, required: true },
    user_phone: { type: String, required: true },
    department_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company.departments"},
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: false },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "HR", "employee","teacher"], default: "employee" },
});

module.exports = mongoose.model("User", UserSchema);