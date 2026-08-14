import { AggregationOrchestrator } from '../aggregationOrchestrator';
import { SalesSystemClient } from '../salesSystemClient';
import { ServiceSystemClient } from '../serviceSystemClient';

jest.mock('../salesSystemClient');
jest.mock('../serviceSystemClient');

describe('Aggregation Orchestrator', () => {
  let orchestrator: AggregationOrchestrator;
  let mockSalesClient: jest.Mocked<SalesSystemClient>;
  let mockServiceClient: jest.Mocked<ServiceSystemClient>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSalesClient = new SalesSystemClient() as jest.Mocked<SalesSystemClient>;
    mockServiceClient = new ServiceSystemClient() as jest.Mocked<ServiceSystemClient>;

    orchestrator = new AggregationOrchestrator();
    (orchestrator as any).salesClient = mockSalesClient;
    (orchestrator as any).serviceClient = mockServiceClient;
  });

  describe('aggregateDocuments', () => {
    it('should aggregate documents from both systems successfully', async () => {
      const salesDocs = {
        vin: 'VIN123',
        documents: [
          { id: 'S1', vin: 'VIN123', title: 'Sales Doc 1', type: 'Contract', date: '2024-01-01' },
          { id: 'S2', vin: 'VIN123', title: 'Sales Doc 2', type: 'Invoice', date: '2024-01-02' },
        ],
      };

      const serviceDocs = {
        vin: 'VIN123',
        documents: [
          { id: 'SV1', vin: 'VIN123', title: 'Service Doc 1', type: 'Service Record', date: '2024-02-01' },
        ],
      };

      mockSalesClient.getDocumentsByVin = jest.fn().mockResolvedValue(salesDocs);
      mockServiceClient.getDocumentsByVin = jest.fn().mockResolvedValue(serviceDocs);

      const result = await orchestrator.aggregateDocuments('VIN123');

      expect(result.documents).toHaveLength(3);
      expect(result.metadata.totalDocuments).toBe(3);
      expect(result.metadata.salesSystemStatus).toBe('success');
      expect(result.metadata.serviceSystemStatus).toBe('success');
      expect(result.metadata.isPartial).toBeUndefined();
    });

    it('should handle empty results from both systems', async () => {
      mockSalesClient.getDocumentsByVin = jest.fn().mockResolvedValue({ vin: 'VIN999', documents: [] });
      mockServiceClient.getDocumentsByVin = jest.fn().mockResolvedValue({ vin: 'VIN999', documents: [] });

      const result = await orchestrator.aggregateDocuments('VIN999');

      expect(result.documents).toHaveLength(0);
      expect(result.metadata.totalDocuments).toBe(0);
      expect(result.metadata.salesSystemStatus).toBe('success');
      expect(result.metadata.serviceSystemStatus).toBe('success');
    });

    it('should handle partial failure - sales system down', async () => {
      mockSalesClient.getDocumentsByVin = jest.fn().mockRejectedValue(new Error('Sales system unavailable'));
      mockServiceClient.getDocumentsByVin = jest.fn().mockResolvedValue({
        vin: 'VIN123',
        documents: [
          { id: 'SV1', vin: 'VIN123', title: 'Service Doc 1', type: 'Service Record', date: '2024-02-01' },
        ],
      });

      const result = await orchestrator.aggregateDocuments('VIN123');

      expect(result.documents).toHaveLength(1);
      expect(result.metadata.totalDocuments).toBe(1);
      expect(result.metadata.salesSystemStatus).toBe('error');
      expect(result.metadata.serviceSystemStatus).toBe('success');
      expect(result.metadata.isPartial).toBe(true);
      expect(result.metadata.errors).toContain('Sales System unavailable');
    });

    it('should handle partial failure - service system down', async () => {
      mockSalesClient.getDocumentsByVin = jest.fn().mockResolvedValue({
        vin: 'VIN123',
        documents: [
          { id: 'S1', vin: 'VIN123', title: 'Sales Doc 1', type: 'Contract', date: '2024-01-01' },
        ],
      });
      mockServiceClient.getDocumentsByVin = jest.fn().mockRejectedValue(new Error('Service system unavailable'));

      const result = await orchestrator.aggregateDocuments('VIN123');

      expect(result.documents).toHaveLength(1);
      expect(result.metadata.totalDocuments).toBe(1);
      expect(result.metadata.salesSystemStatus).toBe('success');
      expect(result.metadata.serviceSystemStatus).toBe('error');
      expect(result.metadata.isPartial).toBe(true);
      expect(result.metadata.errors).toContain('Service System unavailable');
    });

    it('should throw error when both systems fail', async () => {
      mockSalesClient.getDocumentsByVin = jest.fn().mockRejectedValue(new Error('Sales system unavailable'));
      mockServiceClient.getDocumentsByVin = jest.fn().mockRejectedValue(new Error('Service system unavailable'));

      await expect(orchestrator.aggregateDocuments('VIN123')).rejects.toThrow(
        'Unable to retrieve documents from any external system'
      );
    });

    it('should preserve document order - sales first, then service', async () => {
      mockSalesClient.getDocumentsByVin = jest.fn().mockResolvedValue({
        vin: 'VIN123',
        documents: [
          { id: 'S1', vin: 'VIN123', title: 'Sales Doc 1', type: 'Contract', date: '2024-01-01' },
          { id: 'S2', vin: 'VIN123', title: 'Sales Doc 2', type: 'Invoice', date: '2024-01-02' },
        ],
      });
      mockServiceClient.getDocumentsByVin = jest.fn().mockResolvedValue({
        vin: 'VIN123',
        documents: [
          { id: 'SV1', vin: 'VIN123', title: 'Service Doc 1', type: 'Service Record', date: '2024-02-01' },
          { id: 'SV2', vin: 'VIN123', title: 'Service Doc 2', type: 'Inspection', date: '2024-02-15' },
        ],
      });

      const result = await orchestrator.aggregateDocuments('VIN123');

      expect(result.documents[0].id).toBe('S1');
      expect(result.documents[1].id).toBe('S2');
      expect(result.documents[2].id).toBe('SV1');
      expect(result.documents[3].id).toBe('SV2');
    });

    it('should include timestamp in metadata', async () => {
      mockSalesClient.getDocumentsByVin = jest.fn().mockResolvedValue({ vin: 'VIN123', documents: [] });
      mockServiceClient.getDocumentsByVin = jest.fn().mockResolvedValue({ vin: 'VIN123', documents: [] });

      const before = new Date().getTime();
      const result = await orchestrator.aggregateDocuments('VIN123');
      const after = new Date().getTime();

      expect(result.metadata.timestamp).toBeDefined();
      const timestamp = new Date(result.metadata.timestamp).getTime();
      expect(timestamp).toBeGreaterThanOrEqual(before - 100);
      expect(timestamp).toBeLessThanOrEqual(after + 100);
    });

    it('should include VIN in response', async () => {
      mockSalesClient.getDocumentsByVin = jest.fn().mockResolvedValue({ vin: '1HGBH41JXMN109186', documents: [] });
      mockServiceClient.getDocumentsByVin = jest.fn().mockResolvedValue({ vin: '1HGBH41JXMN109186', documents: [] });

      const result = await orchestrator.aggregateDocuments('1HGBH41JXMN109186');

      expect(result.vin).toBe('1HGBH41JXMN109186');
    });

    it('should add correct source attribution', async () => {
      mockSalesClient.getDocumentsByVin = jest.fn().mockResolvedValue({
        vin: 'VIN123',
        documents: [{ id: 'S1', vin: 'VIN123', title: 'Sales Doc', type: 'Contract', date: '2024-01-01' }],
      });
      mockServiceClient.getDocumentsByVin = jest.fn().mockResolvedValue({
        vin: 'VIN123',
        documents: [{ id: 'SV1', vin: 'VIN123', title: 'Service Doc', type: 'Service Record', date: '2024-02-01' }],
      });

      const result = await orchestrator.aggregateDocuments('VIN123');

      expect(result.documents[0].source).toBe('Sales System');
      expect(result.documents[1].source).toBe('Service System');
    });
  });
});
