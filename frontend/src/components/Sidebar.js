import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ isOpen }) => {
    const [dropdowns, setDropdowns] = useState({
        home: false,
        department: false,
        project: false,
        statistics: false,
    });

    const toggleDropdown = (key) => {
        setDropdowns((prev) => ({
            ...prev,
            [key]: !prev[key], // 切換選單狀態
        }));
    };

    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <ul>
                <li>
                    <div className="menu-item" onClick={() => toggleDropdown("home")}>
                        <span>首頁</span>
                        <span className="dropdown-icon">{dropdowns.home ? "▲" : "▼"}</span>
                    </div>
                    <ul className={`dropdown-menu ${dropdowns.home ? "active" : ""}`}>
                        <li><Link to="/login">登入(登出)</Link></li>
                        <li><Link to="#">公告欄</Link></li>
                    </ul>
                </li>
                <li>
                    <div className="menu-item" onClick={() => toggleDropdown("department")}>
                        <span>部門</span>
                        <span className="dropdown-icon">{dropdowns.department ? "▲" : "▼"}</span>
                    </div>
                    <ul className={`dropdown-menu ${dropdowns.department ? "active" : ""}`}>
                        <li><Link to="/companies">公司列表</Link></li>
                        <li><Link to="/department-info">部門資料</Link></li>
                        <li><Link to="/employee-manage">員工管理</Link></li>
                    </ul>
                </li>
                <li>
                    <div className="menu-item" onClick={() => toggleDropdown("project")}>
                        <span>專案</span>
                        <span className="dropdown-icon">{dropdowns.project ? "▲" : "▼"}</span>
                    </div>
                    <ul className={`dropdown-menu ${dropdowns.project ? "active" : ""}`}>
                        <li><Link to="#">專案管理</Link></li>
                        <li><Link to="#">講師管理</Link></li>
                    </ul>
                </li>
                <li>
                    <div className="menu-item" onClick={() => toggleDropdown("statistics")}>
                        <span>統計</span>
                        <span className="dropdown-icon">{dropdowns.statistics ? "▲" : "▼"}</span>
                    </div>
                    <ul className={`dropdown-menu ${dropdowns.statistics ? "active" : ""}`}>
                        <li><Link to="#">儀表板</Link></li>
                    </ul>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
