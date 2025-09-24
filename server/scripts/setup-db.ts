import { pool, testConnection } from '../config/database';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  console.log('🚀 Setting up PostgreSQL database...');

  // Test connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('❌ Could not connect to database. Please check your configuration.');
    process.exit(1);
  }

  try {
    // Read and execute the SQL schema
    const sqlPath = path.join(__dirname, 'init-db.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await pool.query(sql);
    console.log('✅ Database schema created successfully');
    
    console.log('🎉 Database setup completed!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Update your .env file with your PostgreSQL credentials');
    console.log('2. Start the server: npm run dev');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
