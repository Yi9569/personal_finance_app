"use client";
import { useState, useTransition } from "react";

export function NewTransactionForm({ categories, accounts }: { categories: any[]; accounts: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    accountId: accounts[0]?.id ?? "",
    categoryId: categories[0]?.id ?? "",
    amount: "",
    note: ""
  });

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      date: form.date,
      accountId: form.accountId,
      categoryId: form.categoryId,
      amountCents: Math.round(parseFloat(form.amount) * 100)
    };
    if (isNaN(payload.amountCents)) return alert("Amount required");
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, note: form.note || undefined })
    });
    startTransition(() => {
      window.location.reload();
    });
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border p-4 grid md:grid-cols-6 gap-3 items-end">
      <div className="grid gap-1">
        <label className="text-xs text-gray-500">Date</label>
        <input name="date" type="date" value={form.date} onChange={onChange} className="border rounded-lg px-3 py-2"/>
      </div>
      <div className="grid gap-1">
        <label className="text-xs text-gray-500">Account</label>
        <select name="accountId" value={form.accountId} onChange={onChange} className="border rounded-lg px-3 py-2">
          {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>
      <div className="grid gap-1">
        <label className="text-xs text-gray-500">Category</label>
        <select name="categoryId" value={form.categoryId} onChange={onChange} className="border rounded-lg px-3 py-2">
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="grid gap-1">
        <label className="text-xs text-gray-500">Amount (e.g., -12.50)</label>
        <input name="amount" value={form.amount} onChange={onChange} placeholder="-12.50" className="border rounded-lg px-3 py-2"/>
      </div>
      <div className="grid gap-1 md:col-span-2">
        <label className="text-xs text-gray-500">Note</label>
        <input name="note" value={form.note} onChange={onChange} placeholder="Trader Joe's" className="border rounded-lg px-3 py-2"/>
      </div>
      <button type="submit" className="rounded-lg border bg-black text-white px-4 py-2 disabled:opacity-50" disabled={isPending}>
        Add
      </button>
    </form>
  );
}
