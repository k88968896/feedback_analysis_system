const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema({
    form_id: { type: mongoose.Schema.Types.ObjectId, ref: "Form" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    submitted_at: { type: Date, default: Date.now },
    answers: [
        {
            question_id: { type: mongoose.Schema.Types.ObjectId },
            option_id: { type: mongoose.Schema.Types.ObjectId },
            answer_content: { type: String }
        }
    ]
});

module.exports = mongoose.model("Response", ResponseSchema);
