import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { config } from './config/env.js';
import { morganMiddleware } from './utils/logger.js';
import routes from './routes/index.js';
import { notFoundHandler, globalErrorHandler } from './middleware/error.middleware.js';

const app: Application = express();

// Security Middlewares
app.use(helmet());

// CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or postman)
      if (!origin || config.corsOrigins.includes(origin) || config.nodeEnv === 'development') {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy violation: ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Logging Middleware
app.use(morganMiddleware);

// Body Parsing Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static File Serving for Uploaded Claim Documents
const uploadsPath = path.resolve(process.cwd(), config.uploadDir);
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api', routes);

// Convenience root health check route
app.get('/health', (_req, res) => {
  res.redirect('/api/health');
});

// 404 Not Found Middleware
app.use(notFoundHandler);

// Global Error Handler Middleware
app.use(globalErrorHandler);

export default app;
