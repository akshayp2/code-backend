import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

//routes
import userRoutes from './routes/user.routes.js';

// route declaration
app.use('/api/v1/users', userRoutes);

//http:localhost:800/users/api/v1/users/registers
export { app };
