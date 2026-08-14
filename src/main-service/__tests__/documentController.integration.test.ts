import request from 'supertest';
import { createApp } from '../app';
import { SalesSystemClient } from '../services/salesSystemClient';
import { ServiceSystemClient } from '../services/serviceSystemClient';

jest.mock('../services/salesSystemClient');
jest.mock('../services/serviceSystemClient');

describe('Document Controller Integration', () => {
  let app: any;
  let mockSalesClient: jest.Mocked<SalesSystemClient>;
  let mockServiceClient: jest.Mocked<ServiceSystemClient>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the constructors
    (SalesSystemClient as jest.MockedClass<typeof SalesSystemClient>).mockImplementation(() => {
      mockSalesClient = {
        getDocumentsByVin: jest.fn(),
      } as any;
      return mockSalesClient;
    });

    (ServiceSystemClient as jest.MockedClass<typeof ServiceSystemClient>).mockImplementation(() => {
      mockServiceClient = {
        getDocumentsByVin: jest.fn(),
      } as any;
      return mockServiceClient;
    });

    app = createApp();
  });

  describe('GET /api/documents', () => {
    it('should return 200 with documents from both systems', async () => {
      const vin = '1HGBH41JXMN109186';

      mockSalesClient.getDocumentsByVin.mockResolvedValue({
        documents: [
          {
            id: 'S1',
            title: 'Purchase Agreement',
            type: 'Contract',
            date: '2024-01-15',
          },
        ],
      });

      mockServiceClient.getDocumentsByVin.mockResolvedValue({
        documents: [
          {
            id: 'SV1',
            title: 'Oil Change',
            type: 'Service Record',
            date: '2024-02-20',
          },
        ],
      });

      const response = await request(app).get(`/api/documents?vin=${vin}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        vin,
        documents: expect.arrayContaining([
          expect.objectContaining({
            id: 'S1',
            source: 'Sales System',
          }),
          expect.objectContaining({
            id: 'SV1',
            source: 'Service System',
          }),
        ]),
        metadata: expect.objectContaining({
          salesSystemStatus: 'success',
          serviceSystemStatus: 'success',
          totalDocuments: 2,
        }),
      });
    });

    it('should return 400 for invalid VIN', async () => {
      const response = await request(app).get('/api/documents?vin=INVALID');

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: expect.stringContaining('VIN'),
      });
    });

    it('should return 400 for VIN with invalid characters', async () => {
      const response = await request(app).get('/api/documents?vin=1HGBH41JXMN10918I');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid VIN format');
    });

    it('should return 200 with partial results when one system fails', async () => {
      const vin = '1HGBH41JXMN109186';

      mockSalesClient.getDocumentsByVin.mockRejectedValue(
        new Error('Sales system unavailable')
      );

      mockServiceClient.getDocumentsByVin.mockResolvedValue({
        documents: [
          {
            id: 'SV1',
            title: 'Oil Change',
            type: 'Service Record',
            date: '2024-02-20',
          },
        ],
      });

      const response = await request(app).get(`/api/documents?vin=${vin}`);

      expect(response.status).toBe(200);
      expect(response.body.documents).toHaveLength(1);
      expect(response.body.metadata.isPartial).toBe(true);
      expect(response.body.metadata.salesSystemStatus).toBe('error');
      expect(response.body.metadata.serviceSystemStatus).toBe('success');
    });

    it('should return 503 when both systems fail', async () => {
      const vin = '1HGBH41JXMN109186';

      mockSalesClient.getDocumentsByVin.mockRejectedValue(
        new Error('Sales system unavailable')
      );

      mockServiceClient.getDocumentsByVin.mockRejectedValue(
        new Error('Service system unavailable')
      );

      const response = await request(app).get(`/api/documents?vin=${vin}`);

      expect(response.status).toBe(503);
      expect(response.body.error).toBe('Service Unavailable');
    });

    it('should return 200 with empty documents when VIN not found', async () => {
      const vin = '1HGBH41JXMN109186';

      mockSalesClient.getDocumentsByVin.mockResolvedValue({
        documents: [],
      });

      mockServiceClient.getDocumentsByVin.mockResolvedValue({
        documents: [],
      });

      const response = await request(app).get(`/api/documents?vin=${vin}`);

      expect(response.status).toBe(200);
      expect(response.body.documents).toEqual([]);
      expect(response.body.metadata.totalDocuments).toBe(0);
    });

    it('should include correlation ID in response headers', async () => {
      const vin = '1HGBH41JXMN109186';

      mockSalesClient.getDocumentsByVin.mockResolvedValue({
        documents: [],
      });

      mockServiceClient.getDocumentsByVin.mockResolvedValue({
        documents: [],
      });

      const response = await request(app).get(`/api/documents?vin=${vin}`);

      expect(response.headers['x-correlation-id']).toBeDefined();
    });

    it('should accept lowercase VINs', async () => {
      const vin = '1hgbh41jxmn109186';

      mockSalesClient.getDocumentsByVin.mockResolvedValue({
        documents: [],
      });

      mockServiceClient.getDocumentsByVin.mockResolvedValue({
        documents: [],
      });

      const response = await request(app).get(`/api/documents?vin=${vin}`);

      expect(response.status).toBe(200);
      expect(response.body.vin).toBe('1HGBH41JXMN109186');
    });

    it('should return 400 when VIN parameter is missing', async () => {
      const response = await request(app).get('/api/documents');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Bad Request');
    });
  });

  describe('GET /health', () => {
    it('should return 200 with status healthy', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'healthy',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /metrics', () => {
    it('should return metrics in Prometheus format', async () => {
      const response = await request(app).get('/metrics');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/plain');
      expect(response.text).toContain('# HELP');
    });
  });
});
