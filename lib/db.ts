// lib/db.ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For Supabase dev usage we allow self-signed chain; ok for mock/dev only.
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
