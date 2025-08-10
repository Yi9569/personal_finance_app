import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { authUserId } from "@/src/lib/auth";

export async function GET(req: NextRequest) {
  const userId = await authUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");
  const where: any = { userId };
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);
  }
  const txns = await prisma.transaction.findMany({
    where,
    include: { Category: true, Account: true },
    orderBy: { date: "desc" }
  });
  return NextResponse.json(txns);
}

export async function POST(req: NextRequest) {
  const userId = await authUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { accountId, categoryId, date, amountCents, note } = body ?? {};
  if (!accountId || !categoryId || !date || typeof amountCents !== "number")
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const txn = await prisma.transaction.create({
    data: {
      userId,
      accountId,
      categoryId,
      date: new Date(date),
      amountCents,
      note
    }
  });
  return NextResponse.json(txn);
}
