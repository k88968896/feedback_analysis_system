import { Navbar, Container, Nav } from "react-bootstrap";
import { BiMenu } from "react-icons/bi";
import useStore from "../stores/useStore"; // 引入 Zustand store
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
    const { user, logout, hasRole } = useStore(); // 使用 Zustand store
    const navigate = useNavigate();

    // 構建顯示的用戶名稱
    const getUserDisplayName = () => {
        if (!user) return "";

        let displayName = user.user_name; // 使用者名稱
        const companyName = user.company_name || "未指定"; // 公司名稱
        const departmentName = user.department_name || "未指定"; // 部門名稱

        if (hasRole("admin")){
            displayName += `（系統管理員）`;
        } else if (hasRole("company_admin")) {
            displayName += `（${companyName} - 公司負責人）`;
        } else if (hasRole("department_hr")) {
            displayName += `（${companyName} - 部門負責人）`;
        } else if (hasRole("teacher")) {
            displayName += `（教師）`;
        } else if (departmentName) {
            displayName += `（${companyName} - ${departmentName}）`;
        } else {
            displayName += `（無法辨識 請聯繫系統管理員）`;
        }

        return displayName;
    };

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
                                    {getUserDisplayName()}
                                </span>
                                {hasRole("admin") && (
                                    <span className="badge bg-warning ms-2">管理員</span>
                                )}
                                <button 
                                    className="btn btn-link text-light ms-2" 
                                    onClick={logout}
                                >
                                    登出
                                </button>
                            </>
                        ) : (
                            <span onClick={() => navigate("/login")} className="badge bg-secondary">未登入</span>
                        )}
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;
