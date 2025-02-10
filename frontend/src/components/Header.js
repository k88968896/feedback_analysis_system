import "../styles/Header.css";

const Header = ({ toggleSidebar }) => {
    return (
        <header className="header">
            <div className="menu" onClick={toggleSidebar}>
                <span className="menu-icon">≡</span>
            </div>
            <div className="login-status">
                <a href="/login" className="home-link">未登入</a>
            </div>
        </header>
    );
};

export default Header;
