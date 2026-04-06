'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'

interface StatCardProps {
    label: string
    value: string
    sub?: string
    change?: number
    icon: LucideIcon
    accentColor?: string
    index?: number
}

export default function StatCard({ label, value, sub, change, icon: Icon, accentColor = '#3B82F6', index = 0 }: StatCardProps) {
    const isPositive = change !== undefined && change >= 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.38 }}
            className="glass-card p-5 flex flex-col gap-3 group cursor-default"
        >
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {label}
                </p>
                <div className="flex size-9 items-center justify-center rounded-xl transition-all group-hover:scale-110"
                    style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}35` }}>
                    <Icon className="size-4" style={{ color: accentColor }} />
                </div>
            </div>

            <div>
                <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
                {sub && <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{sub}</p>}
            </div>

            {change !== undefined && (
                <div className="flex items-center gap-1.5">
                    {isPositive
                        ? <TrendingUp className="size-3.5 text-emerald-400" />
                        : <TrendingDown className="size-3.5 text-red-400" />
                    }
                    <span className={`text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{change}%
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>vs last month</span>
                </div>
            )}
        </motion.div>
    )
}
