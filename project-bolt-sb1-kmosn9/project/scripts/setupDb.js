import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Veritabanı bağlantısını oluştur
const db = new Database('trading.db');

try {
  // Schema dosyasını oku ve çalıştır
  const schema = readFileSync(join(__dirname, '../src/db/schema.sql'), 'utf8');
  db.exec(schema);

  // Admin kullanıcısını oluştur
  const admin = {
    id: 'admin-1',
    email: 'admin@example.com',
    name: 'Admin',
    account_type: 'real',
    balance: 1000000,
    is_admin: 1,
    verification_status: 'verified'
  };

  // Admin kullanıcısını ekle
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO users (id, email, name, account_type, balance, is_admin, verification_status)
    VALUES (@id, @email, @name, @account_type, @balance, @is_admin, @verification_status)
  `);

  stmt.run(admin);

  console.log('Veritabanı başarıyla oluşturuldu ve örnek veriler eklendi.');
} catch (error) {
  console.error('Veritabanı kurulumu sırasında hata:', error);
  process.exit(1);
} finally {
  db.close();
}