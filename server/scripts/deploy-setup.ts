import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const setupProductionDatabase = async () => {
  console.log('🚀 Setting up production database...');
  try {
    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');

    // Read and execute schema
    const schemaSql = readFileSync(join(__dirname, 'init-db.sql'), 'utf-8');
    await pool.query(schemaSql);
    console.log('✅ Database schema created successfully');
    
    console.log('🎉 Production database setup completed!');
  } catch (error) {
    console.error('❌ Production database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Only run if called directly
if (require.main === module) {
  setupProductionDatabase();
}

export { setupProductionDatabase };
