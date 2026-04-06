'use client'

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import type { CategoryBreakdown } from '@/lib/mockBackend'

// Blue-variant palette for pie segments
const COLORS = [
    '#3B82F6', // blue
    '#1D4ED8', // dark blue
    '#60A5FA', // light blue
    '#93C5FD', // lighter blue
    '#2563EB', // medium blue
    '#10B981', // teal (contrast)
    '#0EA5E9', // sky blue
]

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload as CategoryBreakdown
    return (
        <div className="rounded-xl p-3 text-sm"
            style={{ background: 'rgba(11,18,32,0.97)', border: '1px solid rgba(59,130,246,0.3)', backdropFilter: 'blur(12px)' }}>
            <p className="font-semibold text-white">{d.category}</p>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>₹{d.total.toLocaleString('en-IN')}</p>
            <p style={{ color: '#60A5FA' }}>{d.percentage}% of total</p>
            <p style={{ color: 'rgba(255,255,255,0.35)' }}>{d.count} transactions</p>
        </div>
    )
}

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const R = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + R * Math.cos((-midAngle * Math.PI) / 180)
    const y = cy + R * Math.sin((-midAngle * Math.PI) / 180)
    if (percent < 0.06) return null
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

export default function SpendingPieChart({ data }: { data: CategoryBreakdown[] }) {
    return (
        <ResponsiveContainer width="100%" height={260}>
            <PieChart>
                <Pie data={data} dataKey="total" nameKey="category" cx="50%" cy="50%"
                    outerRadius={100} innerRadius={55} labelLine={false} label={renderLabel}
                    strokeWidth={2} stroke="rgba(11,18,32,0.8)">
                    {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(val) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{val}</span>} />
            </PieChart>
        </ResponsiveContainer>
    )
}
