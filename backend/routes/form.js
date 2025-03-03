const express = require("express");
const Form = require("../models/Form");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// 取得所有表單
router.get("/", verifyToken, async (req, res) => {
    try {
        const forms = await Form.find().populate("created_by", "user_name");
        res.json(forms);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 取得單一表單
router.get("/:formId", verifyToken, async (req, res) => {
    try {
        const form = await Form.findById(req.params.formId);
        if (!form) return res.status(404).json({ message: "表單不存在" });
        res.json(form);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 新增表單
router.post("/", verifyToken, async (req, res) => {
    try {
        const { form_title, form_description, questions } = req.body;
        const newForm = new Form({ form_title, form_description, created_by: req.user._id, questions });
        await newForm.save();
        res.status(201).json({ message: "表單建立成功", form: newForm });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 刪除表單
router.delete("/:formId", verifyToken, async (req, res) => {
    try {
        await Form.findByIdAndDelete(req.params.formId);
        res.json({ message: "表單已刪除" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
