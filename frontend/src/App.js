import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import EmployeeManage from "./pages/EmployeeManage";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000")
            .then(response => setMessage(response.data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/employee-manage" element={<EmployeeManage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
