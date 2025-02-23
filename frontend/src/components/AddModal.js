import "../styles/Modal.css";

const AddModal = ({ title, fields, onChange, onSubmit, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{title}</h2>
                <form onSubmit={onSubmit}>
                    {fields.map((field, index) => (
                        <div className="form-group" key={index}>
                            <label>{field.label}:</label>
                            <input type={field.type} name={field.name} value={field.value} onChange={onChange} required />
                        </div>
                    ))}
                    <button type="submit" className="save-btn">保存</button>
                    <button type="button" className="cancel-btn" onClick={onClose}>取消</button>
                </form>
            </div>
        </div>
    );
};

export default AddModal;
