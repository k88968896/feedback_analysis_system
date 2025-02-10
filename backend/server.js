require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, checkDBConnection } = require("./config/db");
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employee");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get("/api/test-db", (req, res) => {
    if (checkDBConnection()) {
        res.json({ status: "success", message: "MongoDB is connected" });
    } else {
        res.status(500).json({ status: "error", message: "MongoDB is NOT connected" });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

app.get("/", (req, res) => {
    res.send("Express server is running...");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
