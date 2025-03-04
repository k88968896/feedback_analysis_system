import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ element, roles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        // 可以顯示一個加載指示器
        return <div>載入中...</div>;
    }

    // 如果沒有用戶登錄，重定向到登錄頁面
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 如果指定了角色且用戶沒有所需角色，重定向到首頁
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return element;
};

export default PrivateRoute;