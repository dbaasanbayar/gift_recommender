import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function migrate() {
  console.log("Migration эхэллээ...");

  // 1. Шинэ хүснэгтүүд үүсгэнэ
  await sql`
    CREATE TABLE IF NOT EXISTS providers (
      id TEXT PRIMARY KEY,
      business_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      description TEXT,
      approved INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log("✓ providers хүснэгт үүслээ");

  await sql`
    CREATE TABLE IF NOT EXISTS provider_members (
      id TEXT PRIMARY KEY,
      provider_id TEXT NOT NULL REFERENCES providers(id),
      clerk_id TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'owner',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log("✓ provider_members хүснэгт үүслээ");

  // 2. providerUsers өгөгдлийг шилжүүлнэ
  const oldProviders = await sql`SELECT * FROM provider_users`;
  console.log(`✓ ${oldProviders.length} provider олдлоо`);

  for (const old of oldProviders) {
    const providerId = old.id;

    // providers хүснэгтэд нэмнэ (ижил ID-тэй)
    await sql`
      INSERT INTO providers (id, business_name, email, phone, approved, created_at)
      VALUES (${providerId}, ${old.name}, ${old.email}, ${old.phone}, 1, ${old.created_at})
      ON CONFLICT (id) DO NOTHING
    `;

    // providerMembers-д owner болгоно
    await sql`
      INSERT INTO provider_members (id, provider_id, clerk_id, role, created_at)
      VALUES (${crypto.randomUUID()}, ${providerId}, ${old.clerk_id}, 'owner', ${old.created_at})
      ON CONFLICT (clerk_id) DO NOTHING
    `;

    console.log(`✓ ${old.name} шилжлээ`);
  }

  // 3. products хүснэгтэд addedBy багана нэмнэ
  await sql`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS added_by TEXT REFERENCES provider_members(id)
  `;
  console.log("✓ products.added_by багана нэмэгдлээ");

  console.log("Migration амжилттай дууслаа ✅");
  process.exit(0);
}

migrate().catch((e) => {
  console.error("Migration алдаа:", e);
  process.exit(1);
});
