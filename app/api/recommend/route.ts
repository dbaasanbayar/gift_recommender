import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { providers } from "@/db/schema";
import { getEmbedding } from "@/lib/embeddings";
import { sql } from "drizzle-orm";

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

export async function POST(req: NextRequest) {
    const {age, interests, skills} = await req.json();

    // 1. Query текст үүсгэ
    const queryText = `
        ${age} настай хүүхэд.
        Сонирхол: ${interests.join(", ")},
        Хөгжүүлэх чадвар: ${skills.join(", ")}
        `;

    // 2. Query embedding авна
    const queryEmbedding = await getEmbedding(queryText);
    
    // 3. pgvector similarity search
    const similar = await db
        .select()
        .from(providers)
        .where(
            sql`${providers.ageMin} <= ${age} AND ${providers.ageMax} >= ${age}`
        )
        .orderBy(
            sql`embedding <=> ${JSON.stringify(queryEmbedding)}::vector`
        )
        .limit(5);
        
     // 4. Groq-оор тайлбар үүсгэ
     const chat = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `Та хүүхдийн бэлэг зөвлөгч. 
                Доорх бэлгүүдээс хамгийн тохиромжтойг сонгож, 
                яагаад тохиромжтойг монголоор товч тайлбарла.`,
            },
            {
                role: "user",
                content: `Хүүхэд: ${age} нас, сонирхол: ${interests.join(", ")}, 
                хөгжүүлэх чадвар: ${skills.join(", ")}
                
                Бэлгийн сонголтууд:
                ${similar.map((p, i) => 
                  `${i + 1}. ${p.name} (${p.type}) — ${p.description} — ${p.price}₮`
                ).join("\n")}

                Хамгийн тохиромжтой 3-ийг сонгоод тайлбарла.
                `,
            },
        ],
     });

     return NextResponse.json({
        recommendations: similar,
        explanation: chat.choices[0].message.content,
     });
}

