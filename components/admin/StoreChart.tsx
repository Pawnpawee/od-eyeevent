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

// SVG presentation attributes (fill/stroke on chart primitives) don't resolve CSS
// custom properties — mirror the palette tokens here for Recharts props only.
const P = {
  ink:   '#1a1917',
  stone: '#d6d3cd',
  ash:   '#6b6860',
  sand:  '#f0efec',
} as const

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
      <div className="bg-white border border-stone p-6">
        <p className="text-xs font-medium text-drift uppercase tracking-[0.15em] mb-4">Registrations by Store</p>
        <p className="text-sm text-ash">No data yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-stone p-6">
      <p className="text-xs font-medium text-drift uppercase tracking-[0.15em] mb-6">Registrations by Store</p>
      <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 36)}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={P.stone} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: P.ash }} />
          <YAxis
            type="category"
            dataKey="branch"
            width={180}
            tick={{ fontSize: 11, fill: P.ink }}
          />
          <Tooltip
            contentStyle={{ border: `1px solid ${P.stone}`, borderRadius: 0, fontSize: 12 }}
            cursor={{ fill: P.sand }}
            formatter={(value) => [value ?? 0, 'Registrations']}
          />
          <Bar dataKey="count" fill={P.ink} radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
