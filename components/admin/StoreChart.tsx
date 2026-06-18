'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
interface Registration {
  branch: string
}

interface StoreChartProps {
  registrations: Registration[]
}

export default function StoreChart({ registrations }: StoreChartProps) {
  const chartData = Object.values(
    registrations.reduce<Record<string, { branch: string; count: number }>>((acc, r) => {
      if (!acc[r.branch]) acc[r.branch] = { branch: r.branch, count: 0 }
      acc[r.branch].count++
      return acc
    }, {})
  ).sort((a, b) => b.count - a.count)

  if (chartData.length === 0) {
    return (
      <div className="bg-white border border-[#e0e0e0] p-6">
        <p className="text-xs font-medium text-[#666666] uppercase tracking-[0.15em] mb-4">Registrations by Store</p>
        <p className="text-sm text-[#666666]">No data yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#e0e0e0] p-6">
      <p className="text-xs font-medium text-[#666666] uppercase tracking-[0.15em] mb-6">Registrations by Store</p>
      <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 36)}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e0e0" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#666666' }} />
          <YAxis
            type="category"
            dataKey="branch"
            width={180}
            tick={{ fontSize: 11, fill: '#000000' }}
          />
          <Tooltip
            contentStyle={{ border: '1px solid #e0e0e0', borderRadius: 0, fontSize: 12 }}
            cursor={{ fill: '#f5f5f5' }}
            formatter={(value: number) => [value, 'Registrations']}
          />
          <Bar dataKey="count" fill="#000000" radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
