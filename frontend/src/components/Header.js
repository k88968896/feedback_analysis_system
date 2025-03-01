import { Navbar, Container, Nav } from "react-bootstrap";
import { BiMenu } from "react-icons/bi";

const Header = ({ toggleSidebar }) => {
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
                        href="/login" 
                        className="d-flex align-items-center text-light"
                    >
                        <span className="badge bg-secondary">未登入</span>
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;
