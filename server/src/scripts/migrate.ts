import fs from 'fs';
import path from 'path';
import pool from '../db/connection.js';

const runMigrations = async () => {
  try {
    console.log('🔄 Running migrations...');
    const schemaPath = path.join(process.cwd(), 'src/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    await pool.query(schema);
    console.log('✅ Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();
