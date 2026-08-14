export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Unified Document Viewer API',
    version: '1.0.0',
    description:
      'API for searching vehicle documents across multiple dealership systems',
    contact: {
      name: 'Thang Ong Duy',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Documents',
      description: 'Document search operations',
    },
    {
      name: 'Health',
      description: 'Health check endpoints',
    },
    {
      name: 'Metrics',
      description: 'Prometheus metrics',
    },
  ],
  paths: {
    '/api/documents': {
      get: {
        tags: ['Documents'],
        summary: 'Search documents by VIN',
        description:
          'Retrieves all documents for a vehicle from Sales and Service systems',
        parameters: [
          {
            name: 'vin',
            in: 'query',
            required: true,
            description: 'Vehicle Identification Number (17 characters)',
            schema: {
              type: 'string',
              pattern: '^[A-HJ-NPR-Z0-9]{17}$',
              example: '1HGBH41JXMN109186',
            },
          },
          {
            name: 'x-correlation-id',
            in: 'header',
            required: false,
            description: 'Correlation ID for request tracing',
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response with documents',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AggregatedResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid VIN format',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '503': {
            description: 'All external systems unavailable',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Basic health check',
        description: 'Returns service health status',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse',
                },
              },
            },
          },
        },
      },
    },
    '/health/ready': {
      get: {
        tags: ['Health'],
        summary: 'Readiness check',
        description: 'Returns service readiness status',
        responses: {
          '200': {
            description: 'Service is ready',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse',
                },
              },
            },
          },
        },
      },
    },
    '/metrics': {
      get: {
        tags: ['Metrics'],
        summary: 'Prometheus metrics',
        description: 'Returns Prometheus metrics in text format',
        responses: {
          '200': {
            description: 'Metrics data',
            content: {
              'text/plain': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      AggregatedResponse: {
        type: 'object',
        properties: {
          vin: {
            type: 'string',
            example: '1HGBH41JXMN109186',
          },
          documents: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/DocumentWithSource',
            },
          },
          metadata: {
            $ref: '#/components/schemas/ResponseMetadata',
          },
        },
      },
      DocumentWithSource: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'DOC123',
          },
          title: {
            type: 'string',
            example: 'Sales Contract',
          },
          type: {
            type: 'string',
            example: 'Contract',
          },
          date: {
            type: 'string',
            format: 'date',
            example: '2024-01-15',
          },
          source: {
            type: 'string',
            enum: ['Sales System', 'Service System'],
            example: 'Sales System',
          },
        },
      },
      ResponseMetadata: {
        type: 'object',
        properties: {
          salesSystemStatus: {
            type: 'string',
            enum: ['success', 'error'],
          },
          serviceSystemStatus: {
            type: 'string',
            enum: ['success', 'error'],
          },
          totalDocuments: {
            type: 'integer',
            example: 2,
          },
          isPartial: {
            type: 'boolean',
            example: false,
          },
          errors: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Invalid VIN format',
          },
          message: {
            type: 'string',
            example: 'VIN must be exactly 17 alphanumeric characters',
          },
          metadata: {
            type: 'object',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'healthy',
          },
          service: {
            type: 'string',
            example: 'unified-document-viewer',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
  },
};
