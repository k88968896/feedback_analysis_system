const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Employee", EmployeeSchema);
