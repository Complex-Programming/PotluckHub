import pg from 'pg'
import dotenv from 'dotenv'

// Load the environment variables from the .env file
dotenv.config({ path: '../.env' })

const { Pool } = pg

const dbConfig = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT || 5432,
};

// If GCP provides a Unix socket, use it. Otherwise, use the standard host IP.
if (process.env.INSTANCE_UNIX_SOCKET) {
    dbConfig.host = process.env.INSTANCE_UNIX_SOCKET;
} else {
    dbConfig.host = process.env.PGHOST;
}

const pool = new Pool(dbConfig);
export default pool;