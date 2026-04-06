'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Lightbulb, ShieldCheck, Zap, RefreshCw } from 'lucide-react'
import { getAIInsights, type AIInsight } from '@/lib/mockBackend'

const iconMap: Record<string, React.ElementType> = {
    'trending-up': TrendingUp, 'trending-down': TrendingDown,
    'lightbulb': Lightbulb, 'shield': ShieldCheck, 'zap': Zap,
}

const typeStyle: Record<AIInsight['type'], { bg: string; border: string; badge: string; badgeText: string }> = {
    warning: { bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.2)', badge: 'rgba(245,158,11,0.12)', badgeText: '#fbbf24' },
    positive: { bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.2)', badge: 'rgba(16,185,129,0.12)', badgeText: '#34d399' },
    tip: { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.2)', badge: 'rgba(59,130,246,0.12)', badgeText: '#60A5FA' },
    info: { bg: 'rgba(29,78,216,0.07)', border: 'rgba(59,130,246,0.18)', badge: 'rgba(59,130,246,0.12)', badgeText: '#93C5FD' },
}

const typeLabel: Record<AIInsight['type'], string> = {
    warning: 'Alert', positive: 'Great', tip: 'Tip', info: 'Insight',
}

export default function AIInsightsPanel({ showRefresh = false }: { showRefresh?: boolean }) {
    const [insights, setInsights] = useState<AIInsight[]>([])
    const [loading, setLoading] = useState(true)

    const load = () => {
        setLoading(true)
        getAIInsights().then((data) => { setInsights(data); setLoading(false) })
    }

    useEffect(() => { load() }, [])

    return (
        <div className="flex flex-col gap-3">
            {showRefresh && (
                <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'rgba(255,255,255,0.38)' }}>
                        Analysis
                    </p>
                    <button onClick={load}
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <RefreshCw className="size-3" /> Refresh
                    </button>
                </div>
            )}

            {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
                ))
                : insights.map((insight, i) => {
                    const Icon = iconMap[insight.icon] ?? Zap
                    const style = typeStyle[insight.type]
                    return (
                        <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.08 + i * 0.07, duration: 0.3 }}
                            className="flex gap-3 rounded-xl p-3.5 transition-all cursor-default"
                            style={{ background: style.bg, border: `1px solid ${style.border}` }}
                            whileHover={{ scale: 1.008 } as any}
                        >
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                                style={{ background: style.badge, border: `1px solid ${style.border}` }}>
                                <Icon className="size-4" style={{ color: style.badgeText }} />
                            </div>
                            <div className="flex flex-1 flex-col gap-1 min-w-0">
                                <div className="flex items-center gap-2 justify-between flex-wrap">
                                    <h3 className="text-sm font-semibold text-white">{insight.title}</h3>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {insight.metric && (
                                            <span className="text-xs font-bold" style={{ color: style.badgeText }}>{insight.metric}</span>
                                        )}
                                        <span className="text-[10px] font-medium rounded-full px-2 py-0.5"
                                            style={{ background: style.badge, color: style.badgeText }}>
                                            {typeLabel[insight.type]}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                    {insight.description}
                                </p>
                            </div>
                        </motion.div>
                    )
                })
            }
        </div>
    )
}
