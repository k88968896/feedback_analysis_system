import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import Layout from "../components/Layout";
import "../styles/AddForm.css"; // 引入樣式

const AddForm = () => {
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                questionText: "",
                options: ["", "", "", ""], // 預設 4 個選項
                correctAnswer: "A",
                category: "邏輯"
            }
        ]);
    };

    const updateQuestion = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const updateOption = (qIndex, optIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[optIndex] = value;
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (isPublished) => {
        try {
            await API.post("/forms", {
                form_title: formTitle,
                form_description: formDescription,
                is_published: isPublished,
                questions
            });
            navigate("/forms");
        } catch (error) {
            console.error("新增表單失敗:", error);
        }
    };

    return (
        <Layout>
            <div className="form-container">
                <div className="form-header">
                    <input type="text" className="form-title" placeholder="輸入測驗名稱" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
                    <input type="text" className="form-description" placeholder="簡短說明" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
                </div>
                
                {questions.map((q, qIndex) => (
                    <div key={q.id} className="question-block">
                        <input type="text" className="question-input" placeholder="輸入題目" value={q.questionText} onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)} />
                        <span className="answer-label">答案：</span>
                        <select className="answer-select" value={q.correctAnswer} onChange={(e) => updateQuestion(qIndex, "correctAnswer", e.target.value)}>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>

                        <div className="options-container">
                            {q.options.map((opt, optIndex) => (
                                <div key={optIndex} className="option">
                                    <span>({String.fromCharCode(65 + optIndex)})</span>
                                    <input type="text" value={opt} onChange={(e) => updateOption(qIndex, optIndex, e.target.value)} placeholder="輸入選項" />
                                </div>
                            ))}
                        </div>

                        <div className="category">
                            <span>能力分類：</span>
                            <select value={q.category} onChange={(e) => updateQuestion(qIndex, "category", e.target.value)}>
                                <option value="邏輯">邏輯</option>
                                <option value="語言">語言</option>
                                <option value="數學">數學</option>
                                
                            </select>
                            <button className="action-btn" >🔼</button>
                            <button className="action-btn" >🔽</button>
                            <button className="action-btn" >📄</button>
                            <button className="action-btn delete-btn" >🗑️</button>
                        </div>

                    </div>
                ))}

                {/* 右側懸浮按鈕工具列 */}
                <div className="floating-toolbar">
                    <button className="floating-btn" onClick={addQuestion}>＋</button>
                    <button className="floating-btn" onClick={() => handleSubmit(false)}>💾</button>
                    <button className="floating-btn" onClick={() => handleSubmit(true)}>🚀</button>
                </div>
            </div>
        </Layout>
    );
};

export default AddForm;
