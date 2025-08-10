import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { authUserId } from "@/src/lib/auth";

export async function GET(req: NextRequest) {
  const userId = await authUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const monthParam = req.nextUrl.searchParams.get("month") ?? new Date().toISOString();
  const month = new Date(monthParam);
  const budgets = await prisma.budget.findMany({ where: { userId, month } });
  return NextResponse.json(budgets);
}

export async function POST(req: NextRequest) {
  const userId = await authUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const month = new Date(form.get("month") as string);
  const categories = await prisma.category.findMany({ where: { userId, kind: "expense" } });

  await Promise.all(categories.map(async c => {
    const raw = form.get(`budget_${c.id}`)?.toString().trim();
    if (!raw) return;
    const cents = Math.round(parseFloat(raw) * 100);
    if (isNaN(cents)) return;
    await prisma.budget.upsert({
      where: { userId_categoryId_month: { userId, categoryId: c.id, month } },
      update: { amountCents: cents },
      create: { userId, categoryId: c.id, month, amountCents: cents }
    });
  }));

  return NextResponse.redirect(new URL("/budgets", req.url));
}
