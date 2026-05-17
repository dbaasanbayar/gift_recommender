import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { providers, providerMembers, products } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId || userId !== process.env.ADMIN_USER_ID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allProviders = await db
    .select({
      id: providers.id,
      businessName: providers.businessName,
      email: providers.email,
      phone: providers.phone,
      description: providers.description,
      approved: providers.approved,
      createdAt: providers.createdAt,
    })
    .from(providers)
    .orderBy(providers.createdAt);

  return NextResponse.json({ providers: allProviders });
}
