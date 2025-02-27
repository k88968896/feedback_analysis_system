const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
    form_title: { type: String, required: true },
    form_description: { type: String, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questions: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            question_title: { type: String, required: true },
            question_type: { type: String, enum: ["multiple_choice", "text"], required: true },
            options: [{ _id: false, option_id: { type: mongoose.Schema.Types.ObjectId }, option_content: String }]
        }
    ],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Form", FormSchema);
