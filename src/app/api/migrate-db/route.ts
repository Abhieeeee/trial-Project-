import { NextResponse } from "next/server";
import { Client } from "pg";
import fs from "fs";
import path from "path";

export async function GET() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const postgresUrl = process.env.POSTGRES_URL;

  if (!postgresUrl) {
    return NextResponse.json({ error: "Missing POSTGRES_URL on server" }, { status: 500 });
  }

  // Read schema.sql content
  const schemaPath = path.join(process.cwd(), "supabase", "schema.sql");
  if (!fs.existsSync(schemaPath)) {
    return NextResponse.json({ error: `schema.sql not found at ${schemaPath}` }, { status: 500 });
  }

  const schemaSql = fs.readFileSync(schemaPath, "utf-8");

  const client = new Client({
    connectionString: postgresUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  const log: string[] = [];

  try {
    log.push("Connecting to PostgreSQL...");
    await client.connect();
    log.push("Connected successfully!");

    log.push("Executing schema migration script...");
    
    // We execute the SQL schema.
    // Note: since pg allows multiple statements separated by semicolon when using client.query(sql), we can run the whole file.
    await client.query(schemaSql);
    
    log.push("Schema migration completed successfully!");
    
    return NextResponse.json({ success: true, log });
  } catch (err: any) {
    log.push(`Error executing SQL: ${err.message}`);
    return NextResponse.json({ success: false, error: err.message, log });
  } finally {
    await client.end();
  }
}
