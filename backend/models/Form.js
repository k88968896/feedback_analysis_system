const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
    form_title: { type: String, required: true },
    form_description: { type: String, required: true },
    form_type: { type: String, enum: ["survey", "test"], required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    is_public: { type: Boolean, default: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    questions: [
        {
            question_id: { type: mongoose.Schema.Types.ObjectId },
            question_title: { type: String, required: true },
            question_type: { type: String, enum: ["multiple_choice", "text"], required: true },
            is_required: { type: Boolean, default: true },
            options: [
                {
                    option_id: { type: mongoose.Schema.Types.ObjectId },
                    option_content: { type: String, required: true },
                    is_correct: { type: Boolean, default: false }
                }
            ]
        }
    ]
});

module.exports = mongoose.model("Form", FormSchema);
