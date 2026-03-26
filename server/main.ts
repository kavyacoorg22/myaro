import "dotenv/config";
import cors from 'cors';
import express from "express";
import authRoutes from './src/interface/Http/routes/authRoutes';
import cookieParser from 'cookie-parser';
import { connectMongo } from "./src/infrastructure/database/connectDB";
import { errorHandler } from "./src/interface/Http/middleware/errorHandling";
import publicRoutes from './src/interface/Http/routes/publicRoutes';
import beauticianRoute from './src/interface/Http/routes/beauticianRoute';
import redisClient from "./src/infrastructure/redis/redisClient";
import adminRoutes from "./src/interface/Http/routes/adminRoutes";
import { createServer } from "http";
import { initSocket } from "./src/infrastructure/socket/socketInit";
import "./src/infrastructure/config/ffmpegSetup.ts";

const app = express();

app.disable('x-powered-by');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 204
};
app.use((req, res, next) => {
  if (req.path.startsWith('/socket.io')) return next(); 
  cors(corsOptions)(req, res, next);
});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/beautician', beauticianRoute);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

// single server instance shared by Express + Socket.io 
const httpServer = createServer(app);

async function startServer() {
  try {
    await connectMongo();

    try {
      await redisClient.connect();
      console.log("✅ Redis connected");
    } catch (err) {
      console.warn("⚠️ Redis unavailable, continuing without it:", err);
    }

    initSocket(httpServer, process.env.FRONTEND_URL || 'http://localhost:5173');

    const port = process.env.PORT || 4323;
    httpServer.listen(port, () => {
      console.log(`✅ Server running on http://localhost:${port}`);
      console.log(`✅ CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`✅ Socket.io ready`);
    });

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string) {
  console.log(`\n${signal} received. Closing server gracefully...`);

  httpServer.close(async () => {
    console.log('🔄 HTTP server closed');

    try {
      await redisClient.quit();
      console.log('🔄 Redis connection closed');
    } catch (err) {
      console.error('Error closing Redis:', err);
    }

    process.exit(0);
  });
}

startServer();