import { create } from 'zustand';
import API from '../utils/api'; // 引入 API

const useStore = create((set) => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user, loading: false }),
    logout: () => {
        set({ user: null });
        localStorage.removeItem('token');
    },
    fetchUser: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                set({ loading: false });
                return;
            }

            const res = await API.get("/auth/me");
            set({ user: res.data, loading: false });
        } catch (error) {
            console.error("Error fetching user:", error);
            localStorage.removeItem('token');
            set({ user: null, loading: false });
        }
    },
    login: async (company_code, user_account, password) => {
        try {
            const res = await API.post("/auth/login", { company_code, user_account, password });
            localStorage.setItem("token", res.data.token);
            await useStore.getState().fetchUser(); // 獲取用戶信息
        } catch (error) {
            console.error("登入失敗:", error.response?.data?.message);
            throw error;
        }
    },
    hasRole: (role) => {
        const { user } = useStore.getState();
        return user && user.role === role;
    },
    hasAnyRole: (roles) => {
        const { user } = useStore.getState();
        return user && roles.includes(user.role);
    },
}));

export default useStore; 