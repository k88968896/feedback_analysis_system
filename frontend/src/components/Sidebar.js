import { useState } from "react";
import { Link } from "react-router-dom";
import { Nav, Accordion, useAccordionButton } from "react-bootstrap";
import "../styles/Sidebar.css";

const Sidebar = ({ isOpen }) => {
    const [activeKey, setActiveKey] = useState('home'); // 預設展開首頁

    // 自定義切換按鈕
    const CustomToggle = ({ children, eventKey }) => {
        const decoratedOnClick = useAccordionButton(eventKey);

        return (
            <Nav.Link
                onClick={decoratedOnClick}
                className="d-flex justify-content-between align-items-center pe-0"
            >
                {children}
            </Nav.Link>
        );
    };

    return (
        <div className={`bg-light border-end ${isOpen ? "d-block" : "d-none d-md-block"}`} style={{ width: '250px', height: '100vh' }}>
            <Nav className="flex-column p-3">
                <Accordion activeKey={activeKey} onSelect={(k) => setActiveKey(k)} flush>
                    {/* 首頁 */}
                    <Nav.Item>
                        <Accordion.Item eventKey="home" className="border-0">
                            <CustomToggle eventKey="home">
                                <span>首頁</span>
                                <i className={`bi bi-chevron-${activeKey === 'home' ? 'up' : 'down'}`}></i>
                            </CustomToggle>
                            <Accordion.Body className="p-0">
                                <Nav className="flex-column">
                                    <Nav.Link href="#" className="ps-4">公告欄</Nav.Link>
                                </Nav>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Nav.Item>

                    {/* 部門 */}
                    <Nav.Item>
                        <Accordion.Item eventKey="department" className="border-0">
                            <CustomToggle eventKey="department">
                                <span>部門</span>
                                <i className={`bi bi-chevron-${activeKey === 'department' ? 'up' : 'down'}`}></i>
                            </CustomToggle>
                            <Accordion.Body className="p-0">
                                <Nav className="flex-column">
                                    <Nav.Link href="#" className="ps-4">部門管理</Nav.Link>
                                    <Nav.Link href="#" className="ps-4">員工管理</Nav.Link>
                                </Nav>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Nav.Item>

                    {/* 專案 */}
                    <Nav.Item>
                        <Accordion.Item eventKey="project" className="border-0">
                            <CustomToggle eventKey="project">
                                <span>專案</span>
                                <i className={`bi bi-chevron-${activeKey === 'project' ? 'up' : 'down'}`}></i>
                            </CustomToggle>
                            <Accordion.Body className="p-0">
                                <Nav className="flex-column">
                                    <Nav.Link href="#" className="ps-4">專案管理</Nav.Link>
                                    <Nav.Link href="#" className="ps-4">講師管理</Nav.Link>
                                </Nav>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Nav.Item>

                    {/* 統計 */}
                    <Nav.Item>
                        <Accordion.Item eventKey="statistics" className="border-0">
                            <CustomToggle eventKey="statistics">
                                <span>統計</span>
                                <i className={`bi bi-chevron-${activeKey === 'statistics' ? 'up' : 'down'}`}></i>
                            </CustomToggle>
                            <Accordion.Body className="p-0">
                                <Nav className="flex-column">
                                    <Nav.Link href="#" className="ps-4">儀表板</Nav.Link>
                                </Nav>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Nav.Item>

                    {/* 超級管理員 */}
                    <Nav.Item>
                        <Accordion.Item eventKey="admin" className="border-0">
                            <CustomToggle eventKey="admin">
                                <span>超級管理員</span>
                                <i className={`bi bi-chevron-${activeKey === 'admin' ? 'up' : 'down'}`}></i>
                            </CustomToggle>
                            <Accordion.Body className="p-0">
                                <Nav className="flex-column">
                                    <Nav.Link as={Link} to="/companies" className="ps-4">公司列表</Nav.Link>
                                    <Nav.Link as={Link} to="/users" className="ps-4">使用者列表</Nav.Link>
                                </Nav>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Nav.Item>

                    {/* 學科測驗 */}
                    <Nav.Item>
                        <Accordion.Item eventKey="form" className="border-0">
                            <CustomToggle eventKey="form">
                                <span>學科測驗</span>
                                <i className={`bi bi-chevron-${activeKey === 'form' ? 'up' : 'down'}`}></i>
                            </CustomToggle>
                            <Accordion.Body className="p-0">
                                <Nav className="flex-column">
                                    <Nav.Link as={Link} to="/Forms" className="ps-4">測驗管理</Nav.Link>
                                    <Nav.Link as={Link} to="/formlibrary" className="ps-4">題目庫</Nav.Link>
                                </Nav>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Nav.Item>
                </Accordion>
            </Nav>
        </div>
    );
};

export default Sidebar;
