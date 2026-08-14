import { ServiceDatabase } from './database';
import { createChildLogger } from '../../shared/logger';

const logger = createChildLogger('service-seed');

const mockDocuments = [
  {
    id: 'SERVICE-001',
    vin: '1HGBH41JXMN109186',
    title: 'Oil Change Service',
    type: 'Service Record',
    date: '2024-03-20',
  },
  {
    id: 'SERVICE-002',
    vin: '1HGBH41JXMN109186',
    title: 'Tire Rotation',
    type: 'Service Record',
    date: '2024-03-20',
  },
  {
    id: 'SERVICE-003',
    vin: '1HGBH41JXMN109186',
    title: 'Annual Inspection',
    type: 'Inspection',
    date: '2024-02-15',
  },
  {
    id: 'SERVICE-004',
    vin: '2HGES16534H123456',
    title: 'Brake Pad Replacement',
    type: 'Service Record',
    date: '2024-04-10',
  },
  {
    id: 'SERVICE-005',
    vin: '2HGES16534H123456',
    title: 'Battery Replacement',
    type: 'Service Record',
    date: '2024-04-10',
  },
  {
    id: 'SERVICE-006',
    vin: '5YJSA1E14HF123789',
    title: 'Tire Replacement',
    type: 'Service Record',
    date: '2024-05-01',
  },
  {
    id: 'SERVICE-007',
    vin: '5YJSA1E14HF123789',
    title: 'Wheel Alignment',
    type: 'Service Record',
    date: '2024-05-01',
  },
];

export async function seedServiceDatabase(): Promise<void> {
  const db = new ServiceDatabase();

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
