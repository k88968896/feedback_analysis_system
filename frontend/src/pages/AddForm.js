import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import Layout from "../components/Layout";
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import "../styles/AddForm.css";

/**
 * 問題管理容器組件
 * 處理問題的拖拽排序、題型渲染、選項操作等核心功能
 * 包含以下主要功能：
 * - 拖拽排序實現
 * - 不同題型(單選/複選/是非/圖片/簡答)的渲染邏輯
 * - 選項的新增/刪除/修改
 * - 答案選擇切換功能
 */
const QuestionsContainer = ({
    questions,
    setQuestions,
    selectedQuestionIndex,
    setSelectedQuestionIndex,
    updateQuestion,
    updateOption,
    addOption,
    deleteOption,
    deleteQuestion,
    formType,
    showErrors,
    toggleAnswer,
    handleImageUpload,
    validationErrors
}) => {
    const [draggedIndex, setDraggedIndex] = useState(null);

    const onDragStart = (index) => {
        setDraggedIndex(index);
        const questionBlock = document.querySelector(`.question-block[data-index='${index}']`);
        if (questionBlock) {
            questionBlock.classList.add('dragging');
        }
    };

    const onDragEnd = () => {
        const questionBlocks = document.querySelectorAll('.question-block');
        questionBlocks.forEach(block => block.classList.remove('dragging'));
    };

    const onDragOver = (e) => {
        e.preventDefault(); // 防止默認行為
    };

    const onDrop = (index) => {
        if (draggedIndex === null) return;

        const updatedQuestions = Array.from(questions);
        const [removed] = updatedQuestions.splice(draggedIndex, 1);
        updatedQuestions.splice(index, 0, removed);
        setQuestions(updatedQuestions);
        setDraggedIndex(null); // 重置拖曳索引
        onDragEnd(); // 拖曳結束時移除 dragging 類
    };

    /** 根據題型返回對應的選項樣式類型 */
    const getOptionStyle = (questionType) => {
        switch (questionType) {
            case 'checkbox':
                return 'square';
            case 'text':
                return 'text-only';
            default:
                return 'circle';
        }
    };

    return (
        <div
            className="questions-container"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setSelectedQuestionIndex(-1);
                }
            }}
        >
            {Array.isArray(questions) && questions.map((q, qIndex) => (
                <div
                    key={q.id.toString()}
                    className={`question-block ${selectedQuestionIndex === qIndex ? 'selected' : ''}`}
                    data-index={qIndex}
                    draggable="false"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuestionIndex(qIndex);
                    }}
                    onDragOver={onDragOver}
                    onDrop={() => onDrop(qIndex)}
                >
                    
                    <div
                        className="drag-handle"
                        draggable
                        onDragStart={() => onDragStart(qIndex)}
                        onDragEnd={onDragEnd}
                        style={{ cursor: 'grab', textAlign: 'center' }}
                    >
                        &#x2022;&#x2022;&#x2022;
                    </div>
                    <div className="question-header">
                        <input
                            type="text"
                            className={`question-input ${validationErrors[qIndex]?.questionText ? 'error' : ''}`}
                            placeholder="輸入題目..."
                            value={q.questionText}
                            onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                        />
                        {validationErrors[qIndex]?.questionText && (
                            <div className="error-message">{validationErrors[qIndex].questionText}</div>
                        )}
                        <div className="select-container">
                            <select
                                className="question-type-select"
                                value={q.questionType}
                                onChange={(e) => updateQuestion(qIndex, "questionType", e.target.value)}
                            >
                                <option value="radio">單選題</option>
                                <option value="checkbox">複選題</option>
                                <option value="boolean">是非題</option>
                                <option value="image">圖片題</option>
                                <option value="text">簡答題</option>
                            </select>
                        </div>
                    </div>

                    <div className="options-container">
                        {q.questionType === 'text' ? (
                            <div className="option">
                                <input
                                    type="text"
                                    placeholder="簡答題文字輸入區域..."
                                    className="essay-input"
                                    disabled // 簡答題不需要實際存儲選項
                                />
                            </div>
                        ) : q.questionType === 'boolean' ? (
                            <div className="boolean-options">
                                {q.options.map((opt, optIndex) => (
                                    <div key={optIndex} className={`option ${opt.isAnswer ? 'selected-answer' : ''}`}>
                                        <div className="option-style circle">○</div>
                                        <span>{opt.text}</span>
                                        {formType === "quiz" && (
                                            <label className="answer-checkbox">
                                                <input
                                                    type="radio"
                                                    checked={opt.isAnswer || false}
                                                    onChange={() => toggleAnswer(qIndex, optIndex)}
                                                    name={`question-${qIndex}`}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : q.questionType === 'image' ? (
                            q.options.map((opt, optIndex) => (
                                <div key={optIndex} className={`image-option ${opt.isAnswer ? 'selected-answer' : ''}`}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, qIndex, optIndex)}
                                        className="image-upload-input"
                                    />
                                    {opt.text && <img src={opt.text} alt="選項圖片" className="option-image-preview" />}
                                    {formType === "quiz" && (
                                        <label className="answer-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={opt.isAnswer || false}
                                                onChange={() => toggleAnswer(qIndex, optIndex)}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            deleteOption(qIndex, optIndex);
                                        }}
                                        className="delete-btn"
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <>
                                {q.options.map((opt, optIndex) => (
                                    <div key={optIndex} className={`option ${opt.isAnswer ? 'selected-answer' : ''}`}>
                                        <div className={`option-style ${getOptionStyle(q.questionType)}`}>
                                            {q.questionType === 'checkbox' ? '▢' : '○'}
                                        </div>
                                        <input
                                            type="text"
                                            value={opt.text}
                                            className={`${validationErrors[qIndex]?.options?.[optIndex] ? 'error' : ''}`}
                                            onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                                            placeholder="輸入選項"
                                        />
                                        {validationErrors[qIndex]?.options?.[optIndex] && (
                                            <div className="error-message">
                                                {validationErrors[qIndex].options[optIndex]}
                                            </div>
                                        )}
                                        {formType === "quiz" && (
                                            <label className="answer-checkbox">
                                                <input
                                                    type={q.questionType === 'checkbox' ? 'checkbox' : 'radio'}
                                                    checked={opt.isAnswer || false}
                                                    onChange={() => toggleAnswer(qIndex, optIndex)}
                                                    name={`question-${qIndex}`}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        )}
                                        {selectedQuestionIndex === qIndex && (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    deleteOption(qIndex, optIndex);
                                                }}
                                                className="delete-btn"
                                            >
                                                <i className="bi bi-x-lg"></i>
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {formType === "quiz" && validationErrors[qIndex]?.answer && (
                                    <div className="error-message answer-error">
                                        {validationErrors[qIndex].answer}
                                    </div>
                                )}
                            </>
                        )}
                        {(q.questionType !== 'text' && q.questionType !== 'boolean' && selectedQuestionIndex === qIndex) && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    addOption(qIndex);
                                }}
                                className="add-option-btn"
                            >
                                + 新增選項
                            </button>
                        )}
                    </div>

                    <div className="category-score-row">
                        {/* 左側容器 */}
                        <div className="left-controls">
                            <div className="category-container">
                                <div className="category">
                                    <span>能力分類：</span>
                                    <select value={q.category} onChange={(e) => updateQuestion(qIndex, "category", e.target.value)}>
                                        <option value="none">無</option>
                                        <option value="邏輯">邏輯</option>
                                        <option value="語言">語言</option>
                                        <option value="數學">數學</option>
                                    </select>
                                </div>
                            </div>

                            {/* 分隔線和配分輸入 */}
                            {formType === "quiz" && (
                                <>
                                    <div className="separator">|</div>
                                    <div className="score-input">
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="輸入配分"
                                            value={q.score || ""}
                                            onChange={(e) => updateQuestion(qIndex, "score", Number(e.target.value))}
                                            className={`${(!q.score && showErrors) ? 'error' : ''} ${validationErrors[qIndex]?.score ? 'error' : ''}`}
                                        />
                                        {(validationErrors[qIndex]?.score || (!q.score && showErrors)) && (
                                            <div className="error-message">
                                                {validationErrors[qIndex]?.score || "請填寫配分"}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* 右側刪除按鈕 */}
                        {selectedQuestionIndex === qIndex && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    deleteQuestion(qIndex);
                                }}
                                className="delete-question-btn"
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * 主表單組件
 * 包含以下主要功能：
 * - 表單標題與描述管理
 * - 問卷/測驗卷模式切換
 * - 分數分配與重置功能
 * - 問題的新增/提交/存儲
 * - 表單數據驗證與提交
 */
const AddForm = () => {
    // 狀態管理區 (添加分類註解)
    // 基本表單狀態
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");

    // 問題與分數相關狀態
    const [questions, setQuestions] = useState([]);
    const [formType, setFormType] = useState("survey");
    const [targetTotalScore, setTargetTotalScore] = useState("");

    // UI 相關狀態
    const [showErrors, setShowErrors] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showResetConfirmDialog, setShowResetConfirmDialog] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(-1);
    const navigate = useNavigate();

    // 計算總分
    const totalScore = questions.reduce((sum, q) => sum + (q.score || 0), 0);

    // 檢查是否有已存在的配分
    const checkExistingScores = () => {
        return questions.some(q => q.score > 0);
    };

    // 重置所有配分
    const resetAllScores = () => {
        if (checkExistingScores()) {
            setDialogType("reset");
            setShowResetConfirmDialog(true);
            return;
        }
    };

    // 執行重置配分
    const executeReset = () => {
        const updatedQuestions = questions.map(q => ({
            ...q,
            score: 0
        }));
        setQuestions(updatedQuestions);
        setShowResetConfirmDialog(false);
    };

    /** 處理分數分配 - 包含預檢查與實際分配邏輯 */
    const distributeScores = () => {
        if (!targetTotalScore || questions.length === 0) return;

        // 檢查是否有已存在的配分
        if (checkExistingScores()) {
            setDialogType("distribute");
            setShowConfirmDialog(true);
            return;
        }

        executeDistribution();
    };

    /** 執行實際分數分配計算 */
    const executeDistribution = () => {
        const scorePerQuestion = Math.floor(Number(targetTotalScore) / questions.length);
        const updatedQuestions = questions.map(q => ({
            ...q,
            score: scorePerQuestion
        }));

        // 處理除不盡的情況，將剩餘分數加到最後一題
        const remainingScore = Number(targetTotalScore) - (scorePerQuestion * questions.length);
        if (remainingScore > 0 && updatedQuestions.length > 0) {
            updatedQuestions[updatedQuestions.length - 1].score += remainingScore;
        }

        setQuestions(updatedQuestions);
        setTargetTotalScore("");
        setShowConfirmDialog(false);
    };

    /** 新增問題 - 初始化問題數據結構 */
    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                questionText: "",
                options: getInitialOptions("radio"),
                category: "none",
                questionType: "radio",
                answer: "",
                score: 0
            }
        ]);
    };

    const updateQuestion = (index, field, value) => {
        const updatedQuestions = [...questions];

        if (field === 'questionType') {
            updatedQuestions[index].options = getInitialOptions(value);
        }

        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const updateOption = (qIndex, optIndex, value) => {
        const updatedQuestions = [...questions];
        // 如果选项是字符串，转换为对象格式
        if (typeof updatedQuestions[qIndex].options[optIndex] === 'string') {
            updatedQuestions[qIndex].options[optIndex] = {
                text: updatedQuestions[qIndex].options[optIndex],
                isAnswer: false
            };
        }
        // 更新text属性而不是直接替换整个对象
        updatedQuestions[qIndex].options[optIndex].text = value;
        setQuestions(updatedQuestions);
    };

    const addOption = (qIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options.push({ text: "", isAnswer: false });
        setQuestions(updatedQuestions);
    };

    const deleteOption = (qIndex, optIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options.splice(optIndex, 1);
        setQuestions(updatedQuestions);
    };

    const deleteQuestion = (qIndex) => {
        const updatedQuestions = questions.filter((_, index) => index !== qIndex);
        setQuestions(updatedQuestions);
    };

    const toggleAnswer = (qIndex, optIndex) => {
        const updatedQuestions = [...questions];
        const question = updatedQuestions[qIndex];

        if (question.questionType === 'radio' || question.questionType === 'boolean') {
            question.options.forEach(opt => opt.isAnswer = false);
        }

        question.options[optIndex].isAnswer = !question.options[optIndex].isAnswer;
        setQuestions(updatedQuestions);
    };

    // 在 AddForm 組件中添加狀態管理錯誤訊息
    const [validationErrors, setValidationErrors] = useState({});

    /** 表單提交處理 - 包含驗證與API調用 */
    const handleSubmit = async (isPublished) => {
        const errors = {};
        let firstErrorIndex = -1;

        // 驗證所有題目
        questions.forEach((q, qIndex) => {
            const questionErrors = {};

            // 驗證題目文字
            if (!q.questionText.trim()) {
                questionErrors.questionText = "請輸入題目內容";
                if (firstErrorIndex === -1) firstErrorIndex = qIndex;
            }

            // 驗證選項 (非簡答題/圖片題)
            if (!['text', 'image'].includes(q.questionType)) {
                q.options.forEach((opt, optIndex) => {
                    if (!opt.text.trim()) {
                        questionErrors.options = questionErrors.options || [];
                        questionErrors.options[optIndex] = "請輸入選項內容";
                        if (firstErrorIndex === -1) firstErrorIndex = qIndex;
                    }
                });
            }

            // 驗證答案 (測驗卷模式)
            if (formType === "quiz" && !['text', 'image'].includes(q.questionType)) {
                const hasAnswer = q.options.some(opt => opt.isAnswer);
                if (!hasAnswer) {
                    questionErrors.answer = "請至少選擇一個正確答案";
                    if (firstErrorIndex === -1) firstErrorIndex = qIndex;
                }
            }

            // 驗證配分 (測驗卷模式)
            if (formType === "quiz" && (!q.score || q.score <= 0)) {
                questionErrors.score = "請輸入有效配分";
                if (firstErrorIndex === -1) firstErrorIndex = qIndex;
            }

            if (Object.keys(questionErrors).length > 0) {
                errors[qIndex] = questionErrors;
            }
        });

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setShowErrors(true);

            // 滾動到第一個錯誤題目
            if (firstErrorIndex !== -1) {
                const errorElement = document.querySelectorAll('.question-block')[firstErrorIndex];
                errorElement?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            }
            return;
        }

        try {
            await API.post("/forms", {
                form_title: formTitle,
                form_description: formDescription,
                is_published: isPublished,
                questions,
                form_type: formType,
                total_score: formType === "quiz" ? totalScore : null
            });
            navigate("/forms");
        } catch (error) {
            console.error("新增表單失敗:", error);
        }
    };

    // 在AddForm组件中添加useEffect进行数据迁移
    useEffect(() => {
        const migratedQuestions = questions.map(question => ({
            ...question,
            options: question.options.map(opt =>
                typeof opt === 'string' ? { text: opt, isAnswer: false } : opt
            )
        }));
        if (JSON.stringify(questions) !== JSON.stringify(migratedQuestions)) {
            setQuestions(migratedQuestions);
        }
    }, []); // 空依赖数组表示只在组件加载时运行一次

    // 修正初始化選項的函數，改為接收questionType
    const getInitialOptions = (questionType) => {
        if (questionType === 'boolean') {
            return [
                { text: "是", isAnswer: false },
                { text: "否", isAnswer: false }
            ];
        }
        return [{ text: "", isAnswer: false }];
    };

    // 新增圖片上傳處理函數
    const handleImageUpload = async (e, qIndex, optIndex) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await API.post('/upload', formData);
                const updatedQuestions = [...questions];
                updatedQuestions[qIndex].options[optIndex].text = response.data.url;
                setQuestions(updatedQuestions);
            } catch (error) {
                console.error('圖片上傳失敗:', error);
            }
        }
    };

    return (
        <Layout>
            <Container fluid className="form-container">
                <Row>
                    <Col md={12}>
                        <Form.Group className="form-header mb-4">
                            <Form.Control
                                type="text"
                                className="form-title mb-2"
                                placeholder="輸入測驗名稱"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                            />
                            <Form.Control
                                type="text"
                                className="form-description"
                                placeholder="簡短說明"
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col xs={12}>
                        <div className="form-type-selector">
                            <Button
                                variant={formType === "survey" ? "primary" : "outline-primary"}
                                onClick={() => setFormType("survey")}
                            >
                                問卷
                            </Button>
                            <Button
                                variant={formType === "quiz" ? "primary" : "outline-primary"}
                                onClick={() => setFormType("quiz")}
                            >
                                測驗卷
                            </Button>
                        </div>
                        {formType === "quiz" && (
                            <div className="quiz-button-container">
                                <div className="quiz-controls-row">
                                    <div className="score-distribution">
                                        <span className="total-score">總分：{totalScore} 分</span>
                                        <div className="score-distribution-controls">
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                placeholder="設定總分"
                                                value={targetTotalScore}
                                                onChange={(e) => setTargetTotalScore(e.target.value)}
                                                className="target-score-input"
                                            />
                                            <Button
                                                variant="success"
                                                onClick={distributeScores}
                                                disabled={!targetTotalScore || questions.length === 0}
                                                className="distribute-btn"
                                            >
                                                平均分配
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={resetAllScores}
                                                disabled={questions.length === 0}
                                                className="reset-btn"
                                            >
                                                重置配分
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>

                <QuestionsContainer
                    questions={questions}
                    setQuestions={setQuestions}
                    selectedQuestionIndex={selectedQuestionIndex}
                    setSelectedQuestionIndex={setSelectedQuestionIndex}
                    updateQuestion={updateQuestion}
                    updateOption={updateOption}
                    addOption={addOption}
                    deleteOption={deleteOption}
                    deleteQuestion={deleteQuestion}
                    formType={formType}
                    showErrors={showErrors}
                    toggleAnswer={toggleAnswer}
                    handleImageUpload={handleImageUpload}
                    validationErrors={validationErrors}
                />

                {/* 確認對話框使用 Bootstrap Modal */}
                <Modal show={showConfirmDialog || showResetConfirmDialog} onHide={() => {
                    setShowConfirmDialog(false);
                    setShowResetConfirmDialog(false);
                }}>
                    <Modal.Header closeButton>
                        <Modal.Title>確認{dialogType === "reset" ? "重置" : "覆蓋"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {dialogType === "reset"
                            ? "確定要清除所有題目的配分嗎？此操作無法復原。"
                            : "已有題目設定了配分，是否要覆蓋現有的配分？"}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setShowConfirmDialog(false);
                            setShowResetConfirmDialog(false);
                        }}>
                            取消
                        </Button>
                        <Button variant="danger" onClick={dialogType === "reset" ? executeReset : executeDistribution}>
                            確認{dialogType === "reset" ? "重置" : "覆蓋"}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* 右側懸浮按鈕工具列 */}
                <div className="floating-toolbar">
                    <Button variant="primary" className="floating-btn" onClick={addQuestion}>
                        ＋ 新增問題
                    </Button>
                    <Button variant="secondary" className="floating-btn" onClick={() => handleSubmit(false)}>
                        💾 保存草稿
                    </Button>
                    <Button variant="success" className="floating-btn" onClick={() => handleSubmit(true)}>
                        🚀 發佈
                    </Button>
                </div>
            </Container>
        </Layout>
    );
};

export default AddForm;
