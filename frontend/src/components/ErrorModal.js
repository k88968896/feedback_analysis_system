import "../styles/Modal.css";

const ErrorModal = ({ message, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h3>錯誤</h3>
                <p>{message}</p>
                <button className="cancel-btn" onClick={onClose}>關閉</button>
            </div>
        </div>
    );
};

export default ErrorModal;
