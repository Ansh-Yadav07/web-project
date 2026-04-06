'use client'

import { motion } from 'framer-motion'
import { Sparkles, BarChart2, TrendingUp, Shield } from 'lucide-react'
import AIInsightsPanel from '@/features/insights/AIInsightsPanel'

export default function AIInsightsPage() {
    return (
        <div className="no-scrollbar flex flex-col gap-6 px-5 sm:px-8 py-6 lg:py-8 overflow-y-auto h-full">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl"
                    style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }}>
                    <Sparkles className="size-5 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">AI Insights</h1>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.38)' }}>
                        Personalized financial intelligence
                    </p>
                </div>
            </motion.div>

            {/* How it works — production-friendly */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass-card p-5">
                <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <BarChart2 className="size-4 text-blue-400" /> How Insights Work
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                        { step: '1', title: 'Analyse Spending', desc: 'Reviews all transactions by category against your history' },
                        { step: '2', title: 'Detect Patterns', desc: 'Calculates month-over-month trends and savings rate' },
                        { step: '3', title: 'Personalise', desc: 'Delivers actionable recommendations tailored to your habits' },
                    ].map((item) => (
                        <div key={item.step} className="rounded-xl p-3.5"
                            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.18)' }}>
                            <div className="flex size-7 items-center justify-center rounded-full mb-2 text-xs font-bold"
                                style={{ background: 'rgba(59,130,246,0.2)', color: '#60A5FA' }}>
                                {item.step}
                            </div>
                            <p className="text-sm font-semibold text-white">{item.title}</p>
                            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Insights */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-card p-5">
                <h2 className="text-base font-semibold text-white mb-4">Your Financial Insights</h2>
                <AIInsightsPanel showRefresh />
            </motion.div>

            {/* Personal finance tips */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="glass-card p-5">
                <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="size-4 text-blue-400" /> Financial Wellness Tips
                </h2>
                <div className="flex flex-col gap-2">
                    {[
                        'The 50/30/20 rule — allocate 50% to needs, 30% to wants, 20% to savings.',
                        'Automate SIPs on salary day to ensure consistent, stress-free investing.',
                        'Build an emergency fund covering at least 6 months of fixed expenses.',
                        'Review all subscriptions quarterly and cancel unused ones to reduce leakage.',
                        'Avoid lifestyle inflation — direct salary increments to investments instead.',
                    ].map((tip, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.32 + i * 0.055 }}
                            className="flex items-start gap-3 rounded-xl p-3"
                            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5"
                                style={{ background: 'rgba(59,130,246,0.18)', color: '#60A5FA' }}>
                                {i + 1}
                            </span>
                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{tip}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
