"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SpendingOverTimeLine({ data }: { data: { date: string; net: number }[] }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line dataKey="net" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
