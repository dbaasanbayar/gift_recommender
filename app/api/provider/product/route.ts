import { db } from "@/db";
import { products, providerUsers } from "@/db/schema";
import { getEmbedding } from "@/lib/embeddings";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log("A. Provider product body:", body);
    const { clerkId, name, type, description, price, ageMin, ageMax, interests, skills } = body;

    let provider = await db
        .select()
        .from(providerUsers)
        .where(eq(providerUsers.clerkId, clerkId))
        .then(r => r[0]);

    if (!provider) {
        const inserted = await db
            .insert(providerUsers)
            .values({clerkId, name: "Provider", email: "" })
            .returning();
        provider = inserted[0];
    }

    // Embedding автоматаар үүсгэнэ ← нэмэх
    const embeddingText = `
        ${name}. ${description}.
        Interests: ${interests.join(", ")}.
        Skills: ${skills.join(", ")}.  
        `;
    
    const embedding = await getEmbedding(embeddingText);
    console.log("B. Embedding үүслээ");

    // Бүтээгдэхүүн нэмнэ
    const result = await db.insert(products).values({
        providerId: provider.id,
        name, type, description,
        price: Number(price),
        ageMin: parseInt(ageMin),
        ageMax: parseInt(ageMax),
        interests, skills,
        embedding,
        approved: 0,
      }).returning();
      
      console.log("C. DB-д орлоо:", result[0].id);

    return NextResponse.json({success: true});
}