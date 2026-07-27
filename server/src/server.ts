import app from './app.js';
import { config } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { logger } from './utils/logger.js';

const startServer = async (): Promise<void> => {
  // Connect to MongoDB
  await connectDB();

  // Start HTTP server
  const server = app.listen(config.port, () => {
    logger.info(`[Server] ClaimFlow Express Backend running on port ${config.port} (${config.nodeEnv})`);
    logger.info(`[Server] Health check available at: http://localhost:${config.port}/api/health`);
  });

  // Graceful shutdown handler
  const handleShutdown = async (signal: string) => {
    logger.info(`[Server] Received ${signal}. Initializing graceful shutdown...`);
    server.close(async () => {
      logger.info('[Server] HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });

    // Force shutdown after 10 seconds if graceful close stalls
    setTimeout(() => {
      logger.error('[Server] Forced shutdown due to timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
};

startServer().catch((error) => {
  logger.error('[Server Error] Startup failed:', error);
  process.exit(1);
});
