import { Pool } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_CQAnlgdHS57F@ep-round-king-b126bwc2-pooler.c-5.eu-central-1.aws.neon.tech/neondb?sslmode=require";

let globalPool: Pool | null = null;

export function getDbPool(): Pool {
  if (!globalPool) {
    globalPool = new Pool({ connectionString });
  }
  return globalPool;
}

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const pool = getDbPool();
  let retries = 3;
  let delay = 300;

  while (retries > 0) {
    try {
      const res = await pool.query(text, params);
      return res.rows as T[];
    } catch (err: any) {
      retries--;
      if (retries === 0) throw err;
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
  return [];
}
