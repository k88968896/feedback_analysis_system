const express = require("express");
const Response = require("../models/Response");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// 提交表單回應
router.post("/", verifyToken, async (req, res) => {
    try {
        const { form_id, answers } = req.body;
        const newResponse = new Response({ form_id, user_id: req.user._id, answers });
        await newResponse.save();
        res.status(201).json({ message: "回應已提交" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 取得表單的所有回應
router.get("/:formId", verifyToken, async (req, res) => {
    try {
        const responses = await Response.find({ form_id: req.params.formId }).populate("user_id", "user_name");
        res.json(responses);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
