"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function CategorySpendBar({ data }: { data: { name: string; spent: number }[] }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="spent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
