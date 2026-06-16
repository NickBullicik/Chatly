import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

dotenv.config();

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        if (req.path.startsWith("/api")) {
            return res.status(404).json({ error: "Ruta no encontrada" });
        }
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
    app.listen(PORT, () => console.log("Server running on port: " + PORT));
}

export default app;