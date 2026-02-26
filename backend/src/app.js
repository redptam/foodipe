import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import recipeRoutes from './api/recipeRoutes.js';
import userRoutes from './api/userRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Base error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong on the server' });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../public')));

    app.use((req, res) => {
        res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
    });
}

export default app;
