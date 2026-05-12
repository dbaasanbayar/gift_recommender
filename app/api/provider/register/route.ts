import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { providerUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, phone } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Нэр болон имэйл шаардлагатай" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(providerUsers)
    .where(eq(providerUsers.clerkId, userId))
    .then((r) => r[0] ?? null);

  if (existing) {
    await db
      .update(providerUsers)
      .set({ name, email, phone: phone || null })
      .where(eq(providerUsers.clerkId, userId));
  } else {
    await db.insert(providerUsers).values({
      clerkId: userId,
      name,
      email,
      phone: phone || null,
    });
  }

  return NextResponse.json({ success: true });
}
