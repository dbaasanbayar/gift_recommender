import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { products, providerUsers } from "@/db/schema";
import { getEmbedding } from "@/lib/embeddings";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, type, description, price, ageMin, ageMax, interests, skills } = await req.json();

  let provider = await db
    .select()
    .from(providerUsers)
    .where(eq(providerUsers.clerkId, userId))
    .then((r) => r[0]);
  
  if (!provider) {
    const user = await currentUser();
    const inserted = await db
      .insert(providerUsers)
      .values({
        clerkId: userId,
        name: user?.fullName ?? "Provider",
        email: user?.emailAddresses[0]?.emailAddress ?? "",
      })
      .returning();
    provider = inserted[0];
  }

  const embeddingText = `
    ${name}. ${description}.
    Interests: ${interests.join(", ")}.
    Skills: ${skills.join(", ")}.
  `;

  const embedding = await getEmbedding(embeddingText);

  await db.insert(products).values({
    providerId: provider.id,
    name, type, description,
    price: Number(price),
    ageMin: parseInt(ageMin),
    ageMax: parseInt(ageMax),
    interests, skills,
    embedding,
    approved: 0,
  });

  return NextResponse.json({ success: true });
}
