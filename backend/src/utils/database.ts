import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const DATABASE_PATH = path.join(__dirname, '../../database/hosting_slots.db');

export class Database {
  private db!: sqlite3.Database;

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    const dbDir = path.dirname(DATABASE_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.db = new sqlite3.Database(DATABASE_PATH);
    this.createTables();
  }

  private createTables(): void {
    const schema = `
      CREATE TABLE IF NOT EXISTS hosting_slots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        host_name TEXT NOT NULL,
        host_address TEXT NOT NULL,
        hosting_date DATE NOT NULL UNIQUE,
        start_time TIME NOT NULL,
        additional_notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_hosting_date ON hosting_slots(hosting_date);
    `;

    this.db.exec(schema, (err) => {
      if (err) {
        throw err;
      }
    });
  }

  getAllUpcomingHostingSlots(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM hosting_slots 
        WHERE hosting_date >= date('now', 'localtime') 
        ORDER BY hosting_date ASC
      `;
      
      this.db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  createHostingSlot(slot: any): Promise<number> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO hosting_slots (host_name, host_address, hosting_date, start_time, additional_notes)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      this.db.run(query, [slot.host_name, slot.host_address, slot.hosting_date, slot.start_time, slot.additional_notes || null], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  deleteHostingSlot(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM hosting_slots WHERE id = ?';
      
      this.db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  updateHostingSlot(id: number, slot: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE hosting_slots 
        SET host_name = ?, host_address = ?, hosting_date = ?, start_time = ?, additional_notes = ?
        WHERE id = ?
      `;
      
      this.db.run(query, [
        slot.host_name, 
        slot.host_address, 
        slot.hosting_date, 
        slot.start_time, 
        slot.additional_notes || null, 
        id
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  close(): void {
    this.db.close();
  }
}

export const database = new Database();
