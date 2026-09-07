import express from 'express';
import path, { dirname } from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import groupRouter from './routes/group.js';
import materialRouter from './routes/material.js';
import taskRouter from './routes/task.js';
import { errorHandler } from './middleware/errorHandler.js';
import connectDB from './config/db.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();
const port = process.env.PORT || 10000;

// connect to MongoDB
connectDB();

// Middleware
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/groups', groupRouter);
app.use('/api/materials', materialRouter);
app.use('/api/tasks', taskRouter);
app.use(express.static(path.join(__dirname, 'public')));

// 404 fallback
app.use((req, res, next) => {
    const err = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404);
    next(err);
});

app.use(errorHandler);

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
