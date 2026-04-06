'use client'

import { useState, useEffect, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Coffee, ShoppingCart, Zap, Plane, TrendingUp, Activity, Heart, Gamepad2 } from 'lucide-react'
import { fetchTransactions, type FetchOptions } from '@/lib/mockBackend'
import type { MockTransaction, Category } from '@/lib/mockBackend'

const CATEGORIES: (Category | 'All')[] = ['All', 'Food', 'Shopping', 'Transport', 'Travel', 'Entertainment', 'Health', 'Utilities', 'Other']

const categoryMeta: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    Food: { icon: Coffee, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    Shopping: { icon: ShoppingCart, color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
    Bills: { icon: Zap, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
    Travel: { icon: Plane, color: '#2563EB', bg: 'rgba(37,99,235,0.1)' },
    Income: { icon: TrendingUp, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    Entertainment: { icon: Gamepad2, color: '#93C5FD', bg: 'rgba(147,197,253,0.1)' },
    Health: { icon: Heart, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
    default: { icon: Activity, color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
}

const statusStyle: Record<string, { text: string; bg: string }> = {
    success: { text: '#34d399', bg: 'rgba(16,185,129,0.12)' },
    processing: { text: '#fbbf24', bg: 'rgba(245,158,11,0.12)' },
    failed: { text: '#f87171', bg: 'rgba(239,68,68,0.12)' },
}

interface ActivityFeedProps {
    limit?: number
    showFilters?: boolean
    compact?: boolean
}

export default function ActivityFeed({ limit, showFilters = true, compact = false }: ActivityFeedProps) {
    const [transactions, setTransactions] = useState<MockTransaction[]>([])
    const [category, setCategory] = useState<Category | 'All'>('All')
    const [search, setSearch] = useState('')
    const [isPending, startTransition] = useTransition()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchTransactions({ category, search, limit }).then((data) => {
            setTransactions(data)
            setLoading(false)
        })
    }, [category, search, limit])

    return (
        <div className="flex flex-col gap-4">
            {showFilters && (
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                        <input
                            type="text"
                            placeholder="Search transactions…"
                            value={search}
                            onChange={(e) => startTransition(() => setSearch(e.target.value))}
                            className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                            onFocus={(e) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)' }}
                            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
                        />
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-all"
                                style={category === cat
                                    ? { background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', color: '#fff' }
                                    : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }
                                }
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-1">
                {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
                    ))
                    : transactions.length === 0
                        ? <p className="text-center py-10 text-sm" style={{ color: 'rgba(255,255,255,0.28)' }}>No transactions found.</p>
                        : (
                            <AnimatePresence>
                                {transactions.map((txn, i) => {
                                    const meta = categoryMeta[txn.category] ?? categoryMeta.default
                                    const Icon = meta.icon
                                    const isCredit = txn.type === 'credit'
                                    const ss = statusStyle[txn.status]
                                    return (
                                        <motion.div
                                            key={txn.id}
                                            initial={{ opacity: 0, x: 12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -12 }}
                                            transition={{ delay: i * 0.035, duration: 0.28 }}
                                            className="flex items-center gap-3 rounded-xl p-3 transition-all cursor-default"
                                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                                            whileHover={{ background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.18)' } as any}
                                        >
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                                                style={{ background: meta.bg, border: `1px solid ${meta.color}28` }}>
                                                <Icon className="size-4" style={{ color: meta.color }} />
                                            </div>
                                            <div className="flex flex-1 flex-col min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{txn.name}</p>
                                                {!compact && (
                                                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                                        {txn.merchant} · {new Date(txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </p>
                                                )}
                                            </div>
                                            {!compact && (
                                                <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 shrink-0"
                                                    style={{ background: ss.bg, color: ss.text }}>
                                                    {txn.status}
                                                </span>
                                            )}
                                            <span className={`text-sm font-bold shrink-0 ${isCredit ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {isCredit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                                            </span>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        )
                }
            </div>
        </div>
    )
}
