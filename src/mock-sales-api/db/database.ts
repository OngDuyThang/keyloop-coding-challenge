import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { config } from '../../shared/config';
import { createChildLogger } from '../../shared/logger';

const logger = createChildLogger('sales-db');

export class SalesDatabase {
  private db: sqlite3.Database | null = null;

  async initialize(): Promise<void> {
    const dbPath = config.database.salesDbPath;
    const dbDir = path.dirname(dbPath);

    // Ensure data directory exists
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbPath, async (err) => {
        if (err) {
          logger.error('Failed to open database', { error: err.message });
          reject(err);
          return;
        }

        try {
          await this.createSchema();
          logger.info('Sales database initialized', { path: dbPath });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private async createSchema(): Promise<void> {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    return new Promise((resolve, reject) => {
      this.db!.exec(schema, (err) => {
        if (err) {
          logger.error('Failed to create schema', { error: err.message });
          reject(err);
        } else {
          logger.info('Sales database schema created');
          resolve();
        }
      });
    });
  }

  async getDocumentsByVin(vin: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id, vin, title, type, date FROM documents WHERE vin = ?';

      this.db!.all(query, [vin], (err, rows) => {
        if (err) {
          logger.error('Database query failed', { vin, error: err.message });
          reject(err);
        } else {
          logger.debug('Documents retrieved', { vin, count: rows.length });
          resolve(rows);
        }
      });
    });
  }

  async insertDocument(doc: {
    id: string;
    vin: string;
    title: string;
    type: string;
    date: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT OR REPLACE INTO documents (id, vin, title, type, date)
        VALUES (?, ?, ?, ?, ?)
      `;

      this.db!.run(
        query,
        [doc.id, doc.vin, doc.title, doc.type, doc.date],
        (err) => {
          if (err) {
            logger.error('Failed to insert document', {
              id: doc.id,
              error: err.message,
            });
            reject(err);
          } else {
            logger.debug('Document inserted', { id: doc.id });
            resolve();
          }
        }
      );
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            logger.error('Failed to close database', { error: err.message });
            reject(err);
          } else {
            logger.info('Sales database closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}
