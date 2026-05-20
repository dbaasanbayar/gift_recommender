import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, providers } from "@/db/schema";
import { getEmbedding } from "@/lib/embeddings";
import { searchGoogleShopping } from "@/lib/shopping";
import { sql, and, eq } from "drizzle-orm";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { age, interests, skills, gender } = await req.json();

  const genderText = gender === "boy" ? "хөвгүүн" : gender === "girl" ? "охин" : "";
  const queryText = `
    ${age} настай ${genderText} хүүхэд.
    Сонирхол: ${interests.join(", ")}.
    Хөгжүүлэх чадвар: ${skills.join(", ")}.
  `;

  // Provider RAG + Google Shopping зэрэг хайна
  const [queryEmbedding, googleProducts] = await Promise.all([
    getEmbedding(queryText),
    searchGoogleShopping(age, interests, skills).catch(() => []),
  ]);

  // Vector search — interest overlap pre-filter + vector ranking
  // Pre-filter by interest overlap first so skill-only matches (e.g. guitar
  // matching "patience" even when user searched "sport") don't pollute results.
  // Fall back to no interest filter if nothing matches (graceful degradation).
  const interestFilter = sql`${products.interests} && ARRAY[${sql.join(interests.map((i: string) => sql`${i}`), sql`, `)}]::text[]`;
  const skillFilter    = sql`${products.skills}    && ARRAY[${sql.join(skills.map((s: string)    => sql`${s}`), sql`, `)}]::text[]`;

  let providerProducts = await db
    .select({
      id: products.id,
      name: products.name,
      type: products.type,
      description: products.description,
      price: products.price,
      providerName: providers.businessName,
      providerEmail: providers.email,
    })
    .from(products)
    .leftJoin(providers, eq(products.providerId, providers.id))
    .where(
      and(
        sql`${products.ageMin} <= ${age} AND ${products.ageMax} >= ${age}`,
        eq(products.approved, 1),
        interestFilter,
        skillFilter,
      )
    )
    .orderBy(sql`embedding <=> ${JSON.stringify(queryEmbedding)}::vector`)
    .limit(3);

  // Graceful fallback: if strict match returns nothing, try interest-only
  if (providerProducts.length === 0) {
    providerProducts = await db
      .select({
        id: products.id,
        name: products.name,
        type: products.type,
        description: products.description,
        price: products.price,
        providerName: providers.businessName,
        providerEmail: providers.email,
      })
      .from(products)
      .leftJoin(providers, eq(products.providerId, providers.id))
      .where(
        and(
          sql`${products.ageMin} <= ${age} AND ${products.ageMax} >= ${age}`,
          eq(products.approved, 1),
          interestFilter,
        )
      )
      .orderBy(sql`embedding <=> ${JSON.stringify(queryEmbedding)}::vector`)
      .limit(3);
  }

  // Groq — хоёр эх үүсвэрийг нэгтгэж тайлбарлана
  const chat = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "Та хүүхдийн бэлэг зөвлөгч. Монголоор товч тайлбарла.",
      },
      {
        role: "user",
        content: `
          Хүүхэд: ${age} нас${genderText ? `, ${genderText}` : ""}
          Сонирхол: ${interests.join(", ")}
          Хөгжүүлэх чадвар: ${skills.join(", ")}

          Монгол бэлгүүд:
          ${providerProducts.map((p, i) =>
            `${i + 1}. ${p.name} — ${p.description} — ${p.price}₮`
          ).join("\n")}

          Олон улсын бэлгүүд (Google Shopping):
          ${googleProducts.slice(0, 5).map((p, i) =>
            `${i + 1}. ${p.title} — ${p.price}`
          ).join("\n")}

          Монгол болон олон улсын бэлгүүдээс хамгийн тохиромжтой зүйлсийг товч тайлбарла.
        `,
      },
    ],
  });

  return NextResponse.json({
    providerProducts,
    googleProducts,
    explanation: chat.choices[0].message.content,
  });
}


