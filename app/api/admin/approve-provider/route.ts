import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { providers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId || userId !== process.env.ADMIN_USER_ID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { providerId, approved } = await req.json();

  if (!providerId || typeof approved !== "number") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await db.update(providers).set({ approved }).where(eq(providers.id, providerId));

  return NextResponse.json({ success: true });
}
