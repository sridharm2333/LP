import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import groupRoutes from './routes/groupRoutes';
import penguinCircleRoutes from './routes/penguinCircleRoutes';
import reportRoutes from './routes/reportRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/penguin-circle', penguinCircleRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/user', userRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

export default app;
