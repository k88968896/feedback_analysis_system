import { Navigate } from "react-router-dom";
import useStore from "../stores/useStore"; // 引入 Zustand store

const PrivateRoute = ({ element, roles }) => {
    const { user, loading, hasAnyRole } = useStore(); // 使用 Zustand store

    if (loading) {
        // 可以顯示一個加載指示器
        return <div>載入中...</div>;
    }

    // 如果沒有用戶登錄，重定向到登錄頁面
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 如果指定了角色且用戶沒有所需角色，重定向到首頁
    if (roles && !hasAnyRole(roles)) {
        return <Navigate to="/" replace />;
    }

    return element;
};

export default PrivateRoute;