require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, checkDBConnection } = require("./config/db");
const authRoutes = require("./routes/auth");
const companyRoutes = require("./routes/company");
const departmentRoutes = require("./routes/department");
const employeeRoutes = require("./routes/employee");
const userRoutes = require("./routes/user");
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/test-db", (req, res) => {
    if (checkDBConnection()) {
        res.json({ status: "success", message: "MongoDB is connected" });
    } else {
        res.status(500).json({ status: "error", message: "MongoDB is NOT connected" });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("Express server is running...");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
