import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import Layout from "../components/Layout";

const FillForm = () => {
    const { formId } = useParams();
    const [form, setForm] = useState(null);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchForm();
    }, []);

    const fetchForm = async () => {
        try {
            const res = await API.get(`/forms/${formId}`);
            setForm(res.data);
        } catch (error) {
            console.error("Error fetching form:", error);
        }
    };

    const handleAnswerChange = (questionId, optionId) => {
        setAnswers({ ...answers, [questionId]: optionId });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/responses", { form_id: formId, answers });
            navigate("/forms");
        } catch (error) {
            console.error("提交表單失敗:", error);
        }
    };

    if (!form) return <p>載入中...</p>;

    return (
        <Layout>
            <h2>{form.form_title}</h2>
            <p>{form.form_description}</p>
            <form onSubmit={handleSubmit}>
                {form.questions.map((question) => (
                    <div key={question.id}>
                        <p>{question.questionText}</p>
                        {question.options.map((option, index) => (
                            <div key={index}>
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={option}
                                    onChange={() => handleAnswerChange(question.id, option)}
                                />
                                {option}
                            </div>
                        ))}
                    </div>
                ))}
                <button type="submit">提交</button>
            </form>
        </Layout>
    );
};

export default FillForm;

