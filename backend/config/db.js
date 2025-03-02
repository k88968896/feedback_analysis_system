const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "feedback_analysis_systemDB"
        });
        isConnected = true;
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        isConnected = false;
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

const checkDBConnection = () => {
    return isConnected;
};

module.exports = { connectDB, checkDBConnection };
