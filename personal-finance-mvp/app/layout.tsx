import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Personal Finance MVP",
  description: "One-day hackathon MVP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="mx-auto max-w-6xl p-4">
          <nav className="flex items-center justify-between py-4">
            <div className="text-xl font-semibold">💸 Finance</div>
            <div className="flex gap-4 text-sm">
              <Link href="/">Dashboard</Link>
              <Link href="/transactions">Transactions</Link>
              <Link href="/budgets">Budgets</Link>
            </div>
          </nav>
          <main className="mt-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
