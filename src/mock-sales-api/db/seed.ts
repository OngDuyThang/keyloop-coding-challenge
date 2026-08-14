import { SalesDatabase } from './database';
import { createChildLogger } from '../../shared/logger';

const logger = createChildLogger('sales-seed');

const mockDocuments = [
  {
    id: 'SALES-001',
    vin: '1HGBH41JXMN109186',
    title: 'Sales Contract',
    type: 'Contract',
    date: '2024-01-15',
  },
  {
    id: 'SALES-002',
    vin: '1HGBH41JXMN109186',
    title: 'Vehicle Purchase Agreement',
    type: 'Agreement',
    date: '2024-01-15',
  },
  {
    id: 'SALES-003',
    vin: '1HGBH41JXMN109186',
    title: 'Trade-In Appraisal',
    type: 'Appraisal',
    date: '2024-01-10',
  },
  {
    id: 'SALES-004',
    vin: '2HGES16534H123456',
    title: 'Sales Invoice',
    type: 'Invoice',
    date: '2024-02-20',
  },
  {
    id: 'SALES-005',
    vin: '2HGES16534H123456',
    title: 'Finance Agreement',
    type: 'Agreement',
    date: '2024-02-20',
  },
  {
    id: 'SALES-006',
    vin: '5YJSA1E14HF123789',
    title: 'Sales Contract',
    type: 'Contract',
    date: '2024-03-05',
  },
];

export async function seedSalesDatabase(): Promise<void> {
  const db = new SalesDatabase();

  try {
    await db.initialize();
    logger.info('Starting database seed');

    for (const doc of mockDocuments) {
      await db.insertDocument(doc);
    }

    logger.info('Database seeded successfully', {
      documentCount: mockDocuments.length,
    });

    await db.close();
  } catch (error) {
    logger.error('Failed to seed database', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}
