// lib/db.ts
import pkg from "pg";

const { Pool } = pkg;

// Reuse the connection pool (important for Next.js hot reloads)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // must be set in .env.local
});

export default pool;
