
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import CompanyList from "./pages/CompanyList";
import DepartmentList from "./pages/DepartmentList";
import EmployeeList from "./pages/EmployeeList";

function App() {

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/companies" element={<CompanyList />} />
                    <Route path="/departments/:companyId" element={<DepartmentList />} />
                    <Route path="/employees/:departmentId" element={<EmployeeList />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
