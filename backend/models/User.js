const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    user_account: { type: String, required: true, unique: true },
    user_name: { type: String, required: true },
    user_phone: { type: String, required: true },
    user_identity_group: { type: String, required: true, enum: ["HR", "employee", "admin"] },
    department_id: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: false },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: false }
});

module.exports = mongoose.model("User", UserSchema);