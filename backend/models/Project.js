const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    project_name: { type: String, required: true },
    director: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    testers: [
        {
            tester_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        }
    ]
});

module.exports = mongoose.model("Project", ProjectSchema);
