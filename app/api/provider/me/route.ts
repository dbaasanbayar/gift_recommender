import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { providerUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const provider = await db
    .select()
    .from(providerUsers)
    .where(eq(providerUsers.clerkId, userId))
    .then((r) => r[0] ?? null);

  return NextResponse.json({ provider });
}
