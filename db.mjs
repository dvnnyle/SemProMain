import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); 

const { Pool } = pkg;

const pool = new Pool({
  connectionString:
    process.env.ENVIRONMENT === 'production' // Check if environment is 'production'
      ? process.env.DB_CONNECTIONSTRING_PROD // Use production connection string
      : process.env.DB_CONNECTIONSTRING_LOCAL, // Use local connection string for other environments
  ssl: process.env.ENVIRONMENT === 'production' ? { rejectUnauthorized: false } : false, // Disable SSL only for production
});

// Event listeners for pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.on('connect', (client) => {
  console.log('New client connected to the pool');
});

pool.on('remove', (client) => {
  console.log('Client removed from the pool');
});

export default pool;
