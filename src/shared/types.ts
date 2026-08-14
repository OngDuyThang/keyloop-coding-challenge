export interface Document {
  id: string;
  title: string;
  type: string;
  date: string;
  metadata?: Record<string, unknown>;
}

export interface DocumentWithSource extends Document {
  source: 'Sales System' | 'Service System';
}

export interface ExternalApiResponse {
  documents: Document[];
}

export interface AggregatedResponse {
  vin: string;
  documents: DocumentWithSource[];
  metadata: ResponseMetadata;
}

export interface ResponseMetadata {
  salesSystemStatus: 'success' | 'error';
  serviceSystemStatus: 'success' | 'error';
  totalDocuments: number;
  isPartial?: boolean;
  errors?: string[];
  timestamp: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export enum SystemType {
  Sales = 'Sales System',
  Service = 'Service System',
}

export interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeoutMs: number;
}

export interface AppConfig {
  mainService: {
    port: number;
  };
  salesApi: {
    port: number;
    url: string;
  };
  serviceApi: {
    port: number;
    url: string;
  };
  retry: RetryConfig;
  circuitBreaker: CircuitBreakerConfig;
  externalApiTimeoutMs: number;
  logLevel: string;
  database: {
    salesDbPath: string;
    serviceDbPath: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}
