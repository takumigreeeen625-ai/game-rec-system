import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import libraryRoutes from './routes/library';
import recommendationsRoutes from './routes/recommendations';

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/recommendations', recommendationsRoutes);

app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Game Rec System API is running' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// 終了時にPrismaクライアントを切断
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});
