import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getEmbedding } from "@/lib/embeddings";
import { sql } from "drizzle-orm";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { age, interests, skills } = await req.json();

  // 1. Query embedding авна
  const queryText = `
    ${age} настай хүүхэд.
    Сонирхол: ${interests.join(", ")}.
    Хөгжүүлэх чадвар: ${skills.join(", ")}.
  `;
  const queryEmbedding = await getEmbedding(queryText);

  // 2. Vector search + нас filter
  const similar = await db
    .select()
    .from(products)
    .where(
      sql`${products.ageMin} <= ${age} AND ${products.ageMax} >= ${age}`
    )
    .orderBy(
      sql`embedding <=> ${JSON.stringify(queryEmbedding)}::vector`
    )
    .limit(3);

  // 3. Groq тайлбар
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

          Бэлгүүд:
          ${similar.map((p, i) =>
            `${i + 1}. ${p.name} — ${p.description} — ${p.price}₮`
          ).join("\n")}

          Хамгийн тохиромжтой 3-ийг сонгоод яагаад гэдгийг тайлбарла.
        `,
      },
    ],
  });

  return NextResponse.json({
    recommendations: similar,
    explanation: chat.choices[0].message.content,
  });
}