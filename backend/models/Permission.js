const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    form_id: { type: mongoose.Schema.Types.ObjectId, ref: "Form" },
    permission_role: { type: String, enum: ["editor", "viewer"], required: true }
});

module.exports = mongoose.model("Permission", PermissionSchema);
