import "dotenv/config";
import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {

        await pool.query("SELECT NOW()");

        console.log("✅ Database Connected Successfully");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

    } catch (error) {

        console.error("❌ Database Connection Failed");
        console.error(error);

        process.exit(1);
    }
}

startServer();