import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, providers, providerMembers } from "@/db/schema";
import { getEmbedding } from "@/lib/embeddings";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Member болон provider мэдээлэл авна
  const member = await db
    .select({
      memberId: providerMembers.id,
      providerId: providers.id,
      approved: providers.approved,
    })
    .from(providerMembers)
    .leftJoin(providers, eq(providerMembers.providerId, providers.id))
    .where(eq(providerMembers.clerkId, userId))
    .then((r) => r[0] ?? null);

  if (!member) {
    return NextResponse.json({ error: "Provider бүртгэл олдсонгүй" }, { status: 403 });
  }

  if (member.approved !== 1) {
    return NextResponse.json({ error: "Таны бизнес henüz батлагдаагүй байна" }, { status: 403 });
  }

  const { name, type, description, price, ageMin, ageMax, interests, skills } = await req.json();

  const embeddingText = `${name}. ${description}. Interests: ${interests.join(", ")}. Skills: ${skills.join(", ")}.`;
  const embedding = await getEmbedding(embeddingText);

  await db.insert(products).values({
    providerId: member.providerId!,
    addedBy: member.memberId,
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
