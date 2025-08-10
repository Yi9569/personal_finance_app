import { prisma } from "@/src/lib/prisma";
import { authUserId } from "@/src/lib/auth";

export const dynamic = "force-dynamic";

function firstOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default async function BudgetsPage() {
  const userId = await authUserId();
  if (!userId) return <div className="text-red-600">Unauthorized</div>;

  const categories = await prisma.category.findMany({ where: { userId, kind: "expense" }, orderBy: { name: "asc" } });
  const month = firstOfMonth();
  const budgets = await prisma.budget.findMany({ where: { userId, month } });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Budgets</h1>
      <form action="/api/budgets" method="post" className="grid gap-3">
        <input type="hidden" name="month" value={month.toISOString()} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {categories.map((c) => {
            const b = budgets.find(b => b.categoryId === c.id);
            return (
              <div key={c.id} className="rounded-xl border p-3">
                <div className="text-sm">{c.name}</div>
                <input
                  name={`budget_${c.id}`}
                  defaultValue={b ? (b.amountCents/100).toString() : ""}
                  placeholder="0"
                  className="mt-2 border rounded-lg px-3 py-2 w-full"
                />
              </div>
            );
          })}
        </div>
        <button className="rounded-lg border bg-black text-white px-4 py-2 w-fit">Save Budgets</button>
      </form>
      <p className="text-sm text-gray-500">Hint: Enter amounts like 250 or 125.50. This saves the monthly budget for the current month only.</p>
    </div>
  );
}
