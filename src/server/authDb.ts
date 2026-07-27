import initSqlJs, { Database } from 'sql.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export interface AdminUser {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
  last_login: string | null;
}

const DB_FILE_PATH = path.join(process.cwd(), 'smilesync_admin.sqlite');

let dbInstance: Database | null = null;

export async function getAdminDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE_PATH);
      dbInstance = new SQL.Database(fileBuffer);
    } catch (e) {
      console.warn('Could not load existing SQLite file, creating new database instance:', e);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }

  // Create Admin table if not exists
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Administrator',
      created_at TEXT NOT NULL,
      last_login TEXT
    );
  `);

  // Check if default admin exists
  const res = dbInstance.exec(`SELECT * FROM admin WHERE email = 'admin@smilesync.com'`);
  if (!res.length || !res[0].values.length) {
    // Seed default admin account
    const defaultPassword = 'Admin@123';
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(defaultPassword, saltRounds);
    const createdAt = new Date().toISOString();

    dbInstance.run(
      `INSERT INTO admin (full_name, email, password_hash, role, created_at, last_login) VALUES (?, ?, ?, ?, ?, ?)`,
      ['SmileSync Admin', 'admin@smilesync.com', passwordHash, 'Administrator', createdAt, null]
    );

    saveDatabase();
    console.log('✔ Default Admin Account Seeded into SQLite Database: admin@smilesync.com');
  }

  return dbInstance;
}

export function saveDatabase(): void {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE_PATH, buffer);
  } catch (err) {
    console.error('Error persisting SQLite database:', err);
  }
}

export async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  const db = await getAdminDatabase();
  const stmt = db.prepare(`SELECT id, full_name, email, password_hash, role, created_at, last_login FROM admin WHERE LOWER(email) = LOWER(?)`);
  stmt.bind([email.trim()]);

  if (stmt.step()) {
    const row = stmt.getAsObject() as unknown as AdminUser;
    stmt.free();
    return row;
  }

  stmt.free();
  return null;
}

export async function updateAdminLastLogin(id: number): Promise<string> {
  const db = await getAdminDatabase();
  const lastLoginISO = new Date().toISOString();
  db.run(`UPDATE admin SET last_login = ? WHERE id = ?`, [lastLoginISO, id]);
  saveDatabase();
  return lastLoginISO;
}

export async function getAdminById(id: number): Promise<Omit<AdminUser, 'password_hash'> | null> {
  const db = await getAdminDatabase();
  const stmt = db.prepare(`SELECT id, full_name, email, role, created_at, last_login FROM admin WHERE id = ?`);
  stmt.bind([id]);

  if (stmt.step()) {
    const row = stmt.getAsObject() as unknown as Omit<AdminUser, 'password_hash'>;
    stmt.free();
    return row;
  }

  stmt.free();
  return null;
}
