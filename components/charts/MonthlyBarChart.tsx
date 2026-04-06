'use client'

import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend,
} from 'recharts'
import type { MonthStat } from '@/lib/mockBackend'

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl p-3 text-sm"
            style={{ background: 'rgba(11,18,32,0.97)', border: '1px solid rgba(59,130,246,0.3)', backdropFilter: 'blur(12px)' }}>
            <p className="font-semibold text-white mb-2">{label}</p>
            {payload.map((p: any) => (
                <p key={p.name} style={{ color: p.color }} className="font-medium">
                    {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
                </p>
            ))}
        </div>
    )
}

export default function MonthlyBarChart({ data }: { data: MonthStat[] }) {
    return (
        <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} width={50} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, paddingTop: 8 }} />
                <Bar dataKey="expenses" name="Expenses" fill="rgba(59,130,246,0.75)" radius={[5, 5, 0, 0]} />
                <Bar dataKey="income" name="Income" fill="rgba(16,185,129,0.6)" radius={[5, 5, 0, 0]} />
                <Bar dataKey="savings" name="Savings" fill="rgba(96,165,250,0.55)" radius={[5, 5, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}
