import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { authUserId } from "@/src/lib/auth";

export async function GET(req: NextRequest) {
  const userId = await authUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const monthParam = req.nextUrl.searchParams.get("month") ?? new Date().toISOString();
  const month = new Date(monthParam);
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const end = new Date(month.getFullYear(), month.getMonth()+1, 0, 23,59,59,999);

  const txns = await prisma.transaction.findMany({
    where: { userId, date: { gte: start, lte: end } },
    include: { Category: true }
  });

  const income = txns.filter(t => t.amountCents > 0).reduce((s,t)=> s + t.amountCents, 0);
  const expense = txns.filter(t => t.amountCents < 0).reduce((s,t)=> s + t.amountCents, 0);
  const byCategory: Record<string, number> = {};
  txns.forEach(t => {
    if (t.amountCents < 0) {
      byCategory[t.Category.name] = (byCategory[t.Category.name] ?? 0) + Math.abs(t.amountCents);
    }
  });

  return NextResponse.json({
    month: start.toISOString(),
    incomeCents: income,
    expenseCents: Math.abs(expense),
    byCategory
  });
}
