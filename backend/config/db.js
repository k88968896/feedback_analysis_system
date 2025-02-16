const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "feedback_analysis_systemDB"
        });
        isConnected = true;
        console.log("✅ MongoDB Connected Successfully! ${conn.connection.db.databaseName}");
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
