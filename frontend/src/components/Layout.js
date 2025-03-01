import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container, Row, Col } from "react-bootstrap";

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Container fluid className="d-flex flex-column vh-100 p-0">
            <Header toggleSidebar={toggleSidebar} />
            
            <Row className="flex-grow-1 g-0">
                {/* 側邊欄區域 */}
                <Col 
                    md={3} 
                    className={`bg-light border-end ${isSidebarOpen ? "d-block" : "d-none"}`}
                    style={{ width: '250px' }}
                >
                    <Sidebar isOpen={isSidebarOpen} />
                </Col>

                {/* 主要內容區域 */}
                <Col 
                    className="p-4 overflow-auto" 
                    style={{
                        marginLeft: isSidebarOpen,
                        transition: 'margin-left 0.3s ease',
                        width: `calc(100% - ${isSidebarOpen ? 250 : 0}px)`
                    }}
                >
                    {children}
                </Col>
            </Row>
        </Container>
    );
};

export default Layout;
