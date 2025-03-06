import "../styles/Modal.css";
import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddModal = ({ title, fields, onSubmit, onClose }) => {
    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={onSubmit}>
                    {fields.map((field, index) => (
                        <Form.Group key={index} controlId={`form${index}`}>
                            <Form.Label>{field.label}</Form.Label>
                            <Form.Control
                                type={field.type}
                                value={field.value}
                                onChange={field.onChange}
                                required
                            />
                        </Form.Group>
                    ))}
                    <Button variant="primary" type="submit">
                        確定
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddModal;
