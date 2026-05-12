import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getEmbedding } from "@/lib/embeddings";
import { searchGoogleShopping } from "@/lib/shopping";
import { sql, and, eq } from "drizzle-orm";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { age, interests, skills } = await req.json();

  const queryText = `
    ${age} настай хүүхэд.
    Сонирхол: ${interests.join(", ")}.
    Хөгжүүлэх чадвар: ${skills.join(", ")}.
  `;

  // Provider RAG + Google Shopping зэрэг хайна
  const [queryEmbedding, googleProducts] = await Promise.all([
    getEmbedding(queryText),
    searchGoogleShopping(age, interests, skills),
  ]);

  // Vector search — provider бүтээгдэхүүн
  const providerProducts = await db
    .select()
    .from(products)
    .where(
      and(
        sql`${products.ageMin} <= ${age} AND ${products.ageMax} >= ${age}`,
        eq(products.approved, 1)
      )
    )
    .orderBy(sql`embedding <=> ${JSON.stringify(queryEmbedding)}::vector`)
    .limit(3);

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
          Хүүхэд: ${age} нас
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


