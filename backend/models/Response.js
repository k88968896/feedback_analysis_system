const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema({
    form_id: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    submitted_at: { type: Date, default: Date.now },
    answers: [
        {
            question_id: { type: mongoose.Schema.Types.ObjectId, required: true },
            answer_content: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model("Response", ResponseSchema);
