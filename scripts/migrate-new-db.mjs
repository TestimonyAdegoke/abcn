import { Client } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Please provide DATABASE_URL in your environment or .env.local");
  process.exit(1);
}

async function run() {
  console.log("Connecting to Neon database...");
  const client = new Client({ connectionString });
  await client.connect();

  const schemaPath = path.resolve(process.cwd(), "db/schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf-8");

  console.log("Executing db/schema.sql on target database...");
  await client.query(schemaSql);
  console.log("Schema and seed data applied successfully!");

  const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);
  console.log("Public tables:", tablesRes.rows);

  const countRes = await client.query(`SELECT count(*) FROM events;`);
  console.log("Events count:", countRes.rows[0].count);

  await client.end();
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
