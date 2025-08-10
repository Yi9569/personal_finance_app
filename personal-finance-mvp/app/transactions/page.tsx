import { prisma } from "@/src/lib/prisma";
import { authUserId } from "@/src/lib/auth";
import { fmtUSD } from "@/src/lib/date";
import Link from "next/link";
import { NewTransactionForm } from "./transaction-form";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const userId = await authUserId();
  if (!userId) return <div className="text-red-600">Unauthorized</div>;

  const txns = await prisma.transaction.findMany({
    where: { userId },
    include: { Category: true, Account: true },
    orderBy: { date: "desc" }
  });

  const categories = await prisma.category.findMany({ where: { userId }, orderBy: { name: "asc" } });
  const accounts = await prisma.account.findMany({ where: { userId }, orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Transactions</h1>
      <NewTransactionForm categories={categories} accounts={accounts} />
      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Account</th>
              <th className="px-3 py-2 text-left">Category</th>
              <th className="px-3 py-2 text-right">Amount</th>
              <th className="px-3 py-2 text-left">Note</th>
            </tr>
          </thead>
          <tbody>
            {txns.map(t => (
              <tr key={t.id} className="border-t">
                <td className="px-3 py-2">{t.date.toISOString().slice(0,10)}</td>
                <td className="px-3 py-2">{t.Account.name}</td>
                <td className="px-3 py-2">{t.Category.name}</td>
                <td className={"px-3 py-2 text-right " + (t.amountCents < 0 ? "text-red-600" : "text-green-700")}>
                  {fmtUSD(t.amountCents)}
                </td>
                <td className="px-3 py-2">{t.note ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
