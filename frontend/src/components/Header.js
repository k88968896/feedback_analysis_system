import { Navbar, Container, Nav } from "react-bootstrap";
import { BiMenu } from "react-icons/bi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <Navbar bg="dark" variant="dark" expand="md" className="px-3">
            <Container fluid>
                <Navbar.Brand 
                    href="#"
                    onClick={toggleSidebar}
                    className="d-flex align-items-center"
                >
                    <BiMenu className="me-2" style={{ fontSize: '1.5rem' }} />
                    <span>回饋分析系統</span>
                </Navbar.Brand>
                
                <Nav className="ms-auto">
                    <Nav.Link 
                        className="d-flex align-items-center text-light"
                    >
                        {user ? (
                            <>
                                <span 
                                    onClick={() => navigate("/")}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {user.user_name}
                                </span>
                                <button 
                                    className="btn btn-link text-light ms-2" 
                                    onClick={logout}
                                >
                                    登出
                                </button>
                            </>
                        ) : (
                            <span className="badge bg-secondary">未登入</span>
                        )}
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;
