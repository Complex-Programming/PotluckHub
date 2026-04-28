import pg from 'pg'
import dotenv from 'dotenv'

// Load the environment variables from the .env file
dotenv.config({ path: '../.env' })

// const { Pool } = pg

const dbConfig = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
    ssl: {
        rejectUnauthorized: false
    }
};

// If GCP provides a Unix socket, use it. Otherwise, use the standard host IP.
// if (process.env.INSTANCE_UNIX_SOCKET) {
//     dbConfig.host = process.env.INSTANCE_UNIX_SOCKET;
// } else {
//     dbConfig.host = process.env.PGHOST;
// }

const pool = new pg.Pool(dbConfig);
export default pool;