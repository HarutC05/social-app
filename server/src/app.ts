import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { authRoutes } from "./routes/authRoutes";
import { userRoutes } from "./routes/userRoutes";
import { postsRoutes } from "./routes/postsRoutes";
import { commentsRoutes } from "./routes/commentsRoutes";
import { likesRoutes } from "./routes/likesRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api", commentsRoutes);
app.use("/api", likesRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

app.use(errorHandler);

export default app;
