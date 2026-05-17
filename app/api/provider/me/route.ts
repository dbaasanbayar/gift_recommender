import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { providers, providerMembers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const member = await db
    .select({
      memberId: providerMembers.id,
      role: providerMembers.role,
      providerId: providers.id,
      businessName: providers.businessName,
      approved: providers.approved,
    })
    .from(providerMembers)
    .leftJoin(providers, eq(providerMembers.providerId, providers.id))
    .where(eq(providerMembers.clerkId, userId))
    .then((r) => r[0] ?? null);

  return NextResponse.json({ member });
}
