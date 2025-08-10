import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";

// Minimal demo auth: if DEMO=true, ensure a demo user exists and return its id.
export async function authUserId(): Promise<string | null> {
  if (process.env.DEMO === "true") {
    const user = await prisma.user.upsert({
      where: { email: "demo@demo.com" },
      create: { email: "demo@demo.com" },
      update: {}
    });
    return user.id;
  }
  // Placeholder: real auth would read a session/JWT cookie.
  const cookieStore = await cookies();
  const uid = cookieStore.get("uid")?.value;
  return uid ?? null;
}
