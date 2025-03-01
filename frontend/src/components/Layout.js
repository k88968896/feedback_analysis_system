import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container, Row, Col } from "react-bootstrap";

const Layout = ({ children }) => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(user ? true : false);

    const toggleSidebar = () => {
        if (user) {
            setIsSidebarOpen(!isSidebarOpen);
        }
    };

    return (
        <Container fluid className="d-flex flex-column vh-100 p-0">
            <Header toggleSidebar={toggleSidebar} />
            
            <Row className="flex-grow-1 g-0">
                {/* 側邊欄區域 */}
                {user && (
                    <Col 
                        md={3} 
                        className={`bg-light border-end ${isSidebarOpen ? "d-block" : "d-none"}`}
                        style={{ width: '250px' }}
                    >
                        <Sidebar isOpen={isSidebarOpen} />
                    </Col>
                )}

                {/* 主要內容區域 */}
                <Col 
                    className="p-4 overflow-auto" 
                    style={{
                        marginLeft: user && isSidebarOpen,
                        transition: 'margin-left 0.3s ease',
                        width: `calc(100% - ${user && isSidebarOpen ? 250 : 0}px)`
                    }}
                >
                    {children}
                </Col>
            </Row>
        </Container>
    );
};

export default Layout;
