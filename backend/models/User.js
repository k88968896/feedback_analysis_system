const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    companyCode: { type: String, required: true },
    employeeCode: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);