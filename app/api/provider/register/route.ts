import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { providers, providerMembers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { businessName, email, phone, description } = await req.json();

  if (!businessName || !email) {
    return NextResponse.json({ error: "Бизнесийн нэр болон имэйл шаардлагатай" }, { status: 400 });
  }

  // Хэрэглэгч аль хэдийн member эсэхийг шалгана
  const existing = await db
    .select()
    .from(providerMembers)
    .where(eq(providerMembers.clerkId, userId))
    .then((r) => r[0] ?? null);

  if (existing) {
    return NextResponse.json({ error: "Та аль хэдийн бүртгэлтэй байна" }, { status: 400 });
  }

  // Шинэ provider (бизнес) үүсгэнэ
  const [provider] = await db
    .insert(providers)
    .values({ businessName, email, phone: phone || null, description: description || null, approved: 0 })
    .returning();

  // Owner болгон нэмнэ
  await db.insert(providerMembers).values({
    providerId: provider.id,
    clerkId: userId,
    role: "owner",
  });

  return NextResponse.json({ success: true });
}
