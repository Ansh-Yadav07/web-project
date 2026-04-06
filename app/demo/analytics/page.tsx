'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MonthlyBarChart from '@/components/charts/MonthlyBarChart'
import SpendingPieChart from '@/components/charts/SpendingPieChart'
import { getMonthlyStats, getCategoryBreakdown, type MonthStat, type CategoryBreakdown } from '@/lib/mockBackend'

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

export default function AnalyticsPage() {
    const [monthly, setMonthly] = useState<MonthStat[]>([])
    const [categories, setCategories] = useState<CategoryBreakdown[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([getMonthlyStats(), getCategoryBreakdown()]).then(([m, c]) => {
            setMonthly(m); setCategories(c); setLoading(false)
        })
    }, [])

    const last = monthly[monthly.length - 1]

    return (
        <div className="no-scrollbar flex flex-col gap-6 px-5 sm:px-8 py-6 lg:py-8 overflow-y-auto h-full">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Analytics</h1>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
                    Insights into your spending patterns and cash flow
                </p>
            </motion.div>

            {!loading && last && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Income This Month', value: fmt(last.income), color: '#10B981' },
                        { label: 'Expenses This Month', value: fmt(last.expenses), color: '#EF4444' },
                        { label: 'Savings This Month', value: fmt(last.savings), color: '#3B82F6' },
                    ].map((item, i) => (
                        <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            className="glass-card p-4">
                            <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.38)' }}>{item.label}</p>
                            <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
                    <h2 className="text-base font-semibold text-white mb-1">Monthly Cash Flow</h2>
                    <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.38)' }}>Income, expenses & savings — last 6 months</p>
                    <MonthlyBarChart data={monthly} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
                    <h2 className="text-base font-semibold text-white mb-1">Spending by Category</h2>
                    <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.38)' }}>Breakdown of all debit transactions</p>
                    <SpendingPieChart data={categories} />
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
                <h2 className="text-base font-semibold text-white mb-4">Category Breakdown</h2>
                {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-10 rounded-xl mb-2 animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
                    ))
                    : (
                        <div className="flex flex-col gap-2">
                            {categories.map((cat, i) => (
                                <motion.div key={cat.category} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                                    className="flex items-center gap-4 rounded-xl p-3"
                                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="w-28 shrink-0">
                                        <p className="text-sm font-medium text-white">{cat.category}</p>
                                        <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.32)' }}>{cat.count} transactions</p>
                                    </div>
                                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${cat.percentage}%` }}
                                            transition={{ delay: 0.3 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
                                            className="h-full rounded-full"
                                            style={{ background: 'linear-gradient(90deg,#3B82F6,#1D4ED8)' }}
                                        />
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-semibold text-white">{fmt(cat.total)}</p>
                                        <p className="text-[11px]" style={{ color: '#60A5FA' }}>{cat.percentage}%</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
            </motion.div>
        </div>
    )
}
