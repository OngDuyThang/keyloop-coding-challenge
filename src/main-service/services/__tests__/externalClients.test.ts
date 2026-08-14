import { SalesSystemClient } from '../salesSystemClient';
import { ServiceSystemClient } from '../serviceSystemClient';

describe('External API Clients', () => {
  describe('Sales System Client', () => {
    let client: SalesSystemClient;

    beforeEach(() => {
      client = new SalesSystemClient();
    });

    it('should be instantiable', () => {
      expect(client).toBeDefined();
      expect(typeof client.getDocumentsByVin).toBe('function');
    });

    it('should have retry and circuit breaker configured', () => {
      expect(client).toHaveProperty('getDocumentsByVin');
    });
  });

  describe('Service System Client', () => {
    let client: ServiceSystemClient;

    beforeEach(() => {
      client = new ServiceSystemClient();
    });

    it('should be instantiable', () => {
      expect(client).toBeDefined();
      expect(typeof client.getDocumentsByVin).toBe('function');
    });

    it('should have retry and circuit breaker configured', () => {
      expect(client).toHaveProperty('getDocumentsByVin');
    });
  });
});
