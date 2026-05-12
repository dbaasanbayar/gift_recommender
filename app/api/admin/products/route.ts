import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, providerUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();

  if (!userId || userId !== process.env.ADMIN_USER_ID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pending = await db
    .select({
      id: products.id,
      name: products.name,
      type: products.type,
      description: products.description,
      price: products.price,
      ageMin: products.ageMin,
      ageMax: products.ageMax,
      interests: products.interests,
      skills: products.skills,
      approved: products.approved,
      createdAt: products.createdAt,
      providerName: providerUsers.name,
      providerEmail: providerUsers.email,
    })
    .from(products)
    .leftJoin(providerUsers, eq(products.providerId, providerUsers.id))
    .orderBy(products.createdAt);

  return NextResponse.json({ products: pending });
}
