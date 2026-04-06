'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Wallet, TrendingUp, TrendingDown, PiggyBank, Activity,
    BarChart2, Sparkles, ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import StatCard from '@/components/cards/StatCard'
import MonthlyBarChart from '@/components/charts/MonthlyBarChart'
import SpendingPieChart from '@/components/charts/SpendingPieChart'
import ActivityFeed from '@/features/transactions/ActivityFeed'
import AIInsightsPanel from '@/features/insights/AIInsightsPanel'
import {
    getDashboardSummary, getMonthlyStats, getCategoryBreakdown,
    type DashboardSummary, type MonthStat, type CategoryBreakdown,
} from '@/lib/mockBackend'
import { getDemoUser } from '@/lib/demoAuth'
import ConnectedAccounts from '@/components/ConnectedAccounts'

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

export default function ControlCenter() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null)
    const [monthlyStats, setMonthlyStats] = useState<MonthStat[]>([])
    const [categories, setCategories] = useState<CategoryBreakdown[]>([])
    const [chartTab, setChartTab] = useState<'bar' | 'pie'>('bar')
    const [userName, setUserName] = useState('there')

    useEffect(() => {
        const user = getDemoUser()
        if (user) setUserName(user.name)
        getDashboardSummary().then(setSummary)
        getMonthlyStats().then(setMonthlyStats)
        getCategoryBreakdown().then(setCategories)
    }, [])

    const statCards = summary ? [
        { label: 'Total Balance', value: fmt(summary.totalBalance), sub: 'Across all accounts', change: 3, icon: Wallet, accentColor: '#3B82F6' },
        { label: 'Monthly Income', value: fmt(summary.monthlyIncome), sub: 'This month', change: 0, icon: TrendingUp, accentColor: '#10B981' },
        { label: 'Monthly Spend', value: fmt(summary.monthlyExpenses), sub: 'This month', change: summary.balanceChange, icon: TrendingDown, accentColor: '#EF4444' },
        { label: 'Net Savings', value: fmt(summary.monthlySavings), sub: 'Income − Expenses', change: 8, icon: PiggyBank, accentColor: '#60A5FA' },
    ] : []

    return (
        <div className="no-scrollbar flex flex-col gap-6 px-5 sm:px-8 py-6 lg:py-8 overflow-y-auto h-full">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">
                    Welcome back,{' '}
                    <span style={{
                        background: 'linear-gradient(135deg,#60A5FA,#3B82F6)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                    }}>{userName}</span>{' '}👋
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
                    Here's your financial overview for today
                </p>
            </motion.div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {summary
                    ? statCards.map((card, i) => <StatCard key={card.label} {...card} index={i} />)
                    : Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
                    ))
                }
            </div>

            {/* Charts + Activity Feed */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <motion.div
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="xl:col-span-2 glass-card p-5 flex flex-col gap-4"
                >
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <h2 className="text-base font-semibold text-white">Analytics</h2>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
                                {chartTab === 'bar' ? 'Monthly income vs expenses' : 'Spending by category'}
                            </p>
                        </div>
                        <div className="flex gap-1 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                            {([['bar', BarChart2, 'Bar'], ['pie', Activity, 'Pie']] as const).map(([v, Icon, l]) => (
                                <button key={v} onClick={() => setChartTab(v)}
                                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                                    style={chartTab === v
                                        ? { background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', color: '#fff' }
                                        : { color: 'rgba(255,255,255,0.45)' }}>
                                    <Icon className="size-3.5" />{l}
                                </button>
                            ))}
                        </div>
                        <Link href="/demo/analytics" className="flex items-center gap-1 text-xs font-medium"
                            style={{ color: '#60A5FA' }}>
                            View all <ArrowRight className="size-3" />
                        </Link>
                    </div>
                    {chartTab === 'bar' ? <MonthlyBarChart data={monthlyStats} /> : <SpendingPieChart data={categories} />}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="glass-card p-5 flex flex-col gap-4"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
                        <Link href="/demo/transactions" className="flex items-center gap-1 text-xs font-medium"
                            style={{ color: '#60A5FA' }}>
                            View all <ArrowRight className="size-3" />
                        </Link>
                    </div>
                    <ActivityFeed limit={8} showFilters={false} compact />
                </motion.div>
            </div>

            {/* AI Insights */}
            <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="glass-card p-5"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg"
                            style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }}>
                            <Sparkles className="size-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-white">AI Insights</h2>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>Personalized financial analysis</p>
                        </div>
                    </div>
                    <Link href="/demo/ai-insights" className="flex items-center gap-1 text-xs font-medium"
                        style={{ color: '#60A5FA' }}>
                        Full report <ArrowRight className="size-3" />
                    </Link>
                </div>
                <AIInsightsPanel />
            </motion.div>

            {/* Connected Accounts */}
            <div className="glass-card p-5">
                <ConnectedAccounts />
            </div>
        </div>
    )
}
