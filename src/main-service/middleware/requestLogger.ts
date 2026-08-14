import morgan from 'morgan';
import logger from '../../shared/logger';

morgan.token('correlation-id', (req: any) => req.correlationId || 'N/A');

export const requestLogger = morgan(
  ':method :url :status :response-time ms - correlation-id: :correlation-id',
  {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
  }
);
