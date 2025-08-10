import { prisma } from "@/src/lib/prisma";
import { authUserId } from "@/src/lib/auth";
import { firstDayOfMonth, lastDayOfMonth, fmtUSD } from "@/src/lib/date";
import CategorySpendBar from "@/src/components/CategorySpendBar";
import SpendingOverTimeLine from "@/src/components/SpendingOverTimeLine";

export default async function Dashboard() {
  const userId = await authUserId();
  if (!userId) return <div className="text-red-600">Unauthorized</div>;

  const now = new Date();
  const start = firstDayOfMonth(now);
  const end = lastDayOfMonth(now);

  const txns = await prisma.transaction.findMany({
    where: { userId, date: { gte: start, lte: end } },
    include: { Category: true },
    orderBy: { date: "asc" }
  });

  const income = txns.filter(t => t.amountCents > 0).reduce((s,t)=> s + t.amountCents, 0);
  const expense = txns.filter(t => t.amountCents < 0).reduce((s,t)=> s + t.amountCents, 0);
  const byCategory: Record<string, number> = {};
  txns.forEach(t => {
    if (t.amountCents < 0) {
      byCategory[t.Category.name] = (byCategory[t.Category.name] ?? 0) + Math.abs(t.amountCents);
    }
  });

  const barData = Object.entries(byCategory).map(([name, spent]) => ({ name, spent: spent/100 }));
  const lineData = txns.map(t => ({
    date: t.date.toISOString().slice(5,10),
    net: t.amountCents/100
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Income (This Month)" value={fmtUSD(income)} />
        <StatCard label="Expense (This Month)" value={fmtUSD(Math.abs(expense))} />
        <StatCard label="Net (This Month)" value={fmtUSD(income + expense)} />
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Spending by Category</h2>
        <CategorySpendBar data={barData} />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Transactions Over Time</h2>
        <SpendingOverTimeLine data={lineData} />
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
