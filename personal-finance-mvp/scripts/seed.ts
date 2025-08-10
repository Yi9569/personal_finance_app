import { prisma } from "@/src/lib/prisma";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@demo.com" },
    create: { email: "demo@demo.com" },
    update: {}
  });

  const cash = await prisma.account.upsert({
    where: { id: "seed_cash" },
    update: {},
    create: { id: "seed_cash", userId: user.id, name: "Cash", type: "cash" }
  });

  const catGroceries = await prisma.category.upsert({
    where: { id: "seed_groceries" },
    update: {},
    create: { id: "seed_groceries", userId: user.id, name: "Groceries", kind: "expense" }
  });

  const catTranspo = await prisma.category.upsert({
    where: { id: "seed_transport" },
    update: {},
    create: { id: "seed_transport", userId: user.id, name: "Transportation", kind: "expense" }
  });

  const catSalary = await prisma.category.upsert({
    where: { id: "seed_salary" },
    update: {},
    create: { id: "seed_salary", userId: user.id, name: "Salary", kind: "income" }
  });

  // Budgets for current month
  const now = new Date();
  const month = new Date(now.getFullYear(), now.getMonth(), 1);

  await prisma.budget.upsert({
    where: { userId_categoryId_month: { userId: user.id, categoryId: catGroceries.id, month } },
    update: { amountCents: 30000 },
    create: { userId: user.id, categoryId: catGroceries.id, month, amountCents: 30000 }
  });

  // Transactions (one income, two expenses)
  await prisma.transaction.createMany({
    data: [
      { userId: user.id, accountId: cash.id, categoryId: catSalary.id, date: new Date(now.getFullYear(), now.getMonth(), 5), amountCents: 500000, note: "August paycheck" },
      { userId: user.id, accountId: cash.id, categoryId: catGroceries.id, date: new Date(now.getFullYear(), now.getMonth(), 7), amountCents: -4599, note: "Trader Joe's" },
      { userId: user.id, accountId: cash.id, categoryId: catTranspo.id, date: new Date(now.getFullYear(), now.getMonth(), 8), amountCents: -1820, note: "Uber" }
    ]
  });
}

main().then(() => {
  console.log("Seeded ✅");
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
