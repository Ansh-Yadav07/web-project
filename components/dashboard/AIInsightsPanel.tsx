'use client'

import { motion } from 'framer-motion'
import { Sparkles, TrendingDown, ShieldCheck, Lightbulb, ArrowRight } from 'lucide-react'

const insights = [
    {
        icon: TrendingDown,
        color: 'emerald',
        bg: 'rgba(16,185,129,0.1)',
        border: 'rgba(16,185,129,0.25)',
        iconColor: 'text-emerald-400',
        title: 'Spending Down 20%',
        description: 'You spent 20% less on Food & Drink this month compared to February. Great work! 🎉',
        tag: 'Positive Trend',
        tagColor: 'rgba(16,185,129,0.15)',
        tagText: '#34d399',
    },
    {
        icon: Lightbulb,
        color: 'amber',
        bg: 'rgba(245,158,11,0.1)',
        border: 'rgba(245,158,11,0.25)',
        iconColor: 'text-amber-400',
        title: 'Optimize Subscriptions',
        description: 'You have 6 active subscriptions totaling $94/mo. Consider reviewing unused services.',
        tag: 'Opportunity',
        tagColor: 'rgba(245,158,11,0.15)',
        tagText: '#fbbf24',
    },
    {
        icon: ShieldCheck,
        color: 'violet',
        bg: 'rgba(124,58,237,0.12)',
        border: 'rgba(124,58,237,0.3)',
        iconColor: 'text-violet-400',
        title: 'Savings Goal on Track',
        description: 'You\'re 78% of the way to your $5,000 emergency fund goal. Just $1,100 to go!',
        tag: 'On Track',
        tagColor: 'rgba(124,58,237,0.15)',
        tagText: '#a78bfa',
    },
]

const insightVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: 0.3 + i * 0.1, duration: 0.4 },
    }),
}

const AIInsightsPanel = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="glass-card p-5 flex flex-col gap-4"
        >
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg shrink-0"
                    style={{ background: 'linear-gradient(135deg,#7C3AED,#4F46E5)' }}>
                    <Sparkles className="size-4 text-white" />
                </div>
                <div>
                    <h2 className="text-base font-semibold text-white">AI Insights</h2>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Powered by Zensync AI</p>
                </div>
            </div>

            {/* Insight cards */}
            <div className="flex flex-col gap-3">
                {insights.map((insight, i) => {
                    const Icon = insight.icon
                    return (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={insightVariants}
                            initial="hidden"
                            animate="visible"
                            className="group flex gap-3 rounded-xl p-3.5 cursor-pointer transition-all"
                            style={{
                                background: insight.bg,
                                border: `1px solid ${insight.border}`,
                            }}
                            whileHover={{ scale: 1.01 }}
                        >
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                                style={{ background: insight.bg, border: `1px solid ${insight.border}` }}>
                                <Icon className={`size-4 ${insight.iconColor}`} />
                            </div>

                            <div className="flex flex-1 flex-col gap-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="text-sm font-semibold text-white">{insight.title}</h3>
                                    <span
                                        className="text-[10px] font-medium rounded-full px-2 py-0.5 shrink-0"
                                        style={{ background: insight.tagColor, color: insight.tagText }}
                                    >
                                        {insight.tag}
                                    </span>
                                </div>
                                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                                    {insight.description}
                                </p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* CTA */}
            <button
                className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all w-full mt-1"
                style={{
                    background: 'rgba(124,58,237,0.12)',
                    border: '1px solid rgba(124,58,237,0.25)',
                    color: '#a78bfa',
                }}
            >
                View full AI report
                <ArrowRight className="size-3.5" />
            </button>
        </motion.div>
    )
}

export default AIInsightsPanel
