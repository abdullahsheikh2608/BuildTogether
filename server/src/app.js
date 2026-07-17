import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/error.middleware.js";
import startupRoutes from "./routes/startup.routes.js";
import { COMMON_MESSAGES } from "./constants/messages.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "BuildTogether Backend Running 🚀"
    });
});
app.use("/api/v1", routes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: COMMON_MESSAGES.ROUTE_NOT_FOUND,
    });
});

app.use(errorHandler);
export default app;