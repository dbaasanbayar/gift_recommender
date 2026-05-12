import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();

  if (!userId || userId !== process.env.ADMIN_USER_ID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, approved } = await req.json();

  if (!productId || typeof approved !== "number") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await db
    .update(products)
    .set({ approved })
    .where(eq(products.id, productId));

  return NextResponse.json({ success: true });
}
