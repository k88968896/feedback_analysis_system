import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/Layout.css";

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="layout-container">
            <Header toggleSidebar={toggleSidebar} />
            <div className="content-container">
                <Sidebar isOpen={isSidebarOpen} />
                <main className="main-content">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
