"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = Array.from({ length: 30 }, (_, i) => ({
  day: i === 0 ? "Now" : `-${29 - i}d`,
  value: 0 + Math.sin(i * 0.3) * 0 + i * 0 + Math.random()
   * 0,
}))

export function PortfolioChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="day" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip
          contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #334155", borderRadius: 8 }}
          labelStyle={{ color: "#ccc" }}
          formatter={(value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#10b981"
          strokeWidth={3}
          dot={false}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}