'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, CreditCard, Building2 } from 'lucide-react'
import AnimatedCounter from '@/components/AnimatedCounter'
import DoughnutChart from '@/components/DoughnutChart'

interface BalanceCardProps {
    accounts: Account[]
    totalBanks: number
    totalCurrentBalance: number
}

const StatBadge = ({
    icon: Icon,
    label,
    value,
    positive,
}: {
    icon: React.ElementType
    label: string
    value: string
    positive?: boolean
}) => (
    <div className="flex items-center gap-2 rounded-xl p-3"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex size-8 items-center justify-center rounded-lg"
            style={{ background: positive ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}>
            <Icon className={`size-4 ${positive ? 'text-emerald-400' : 'text-red-400'}`} />
        </div>
        <div>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
            <p className="text-sm font-semibold text-white">{value}</p>
        </div>
    </div>
)

const BalanceCard = ({ accounts, totalBanks, totalCurrentBalance }: BalanceCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="glass-card p-6 col-span-full"
        >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Doughnut */}
                <div className="flex size-[110px] shrink-0 items-center">
                    <DoughnutChart accounts={accounts} />
                </div>

                {/* Balance info */}
                <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-widest"
                            style={{ color: 'rgba(255,255,255,0.4)' }}>
                            Total Portfolio Balance
                        </span>
                    </div>

                    <div className="flex items-end gap-2">
                        <div className="text-4xl font-bold text-white tracking-tight">
                            <AnimatedCounter amount={totalCurrentBalance} />
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                        <TrendingUp className="size-3.5 text-emerald-400" />
                        <span className="text-xs text-emerald-400 font-medium">+2.4% this month</span>
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>vs last month</span>
                    </div>
                </div>
            </div>

            {/* Stat badges */}
            <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3">
                <StatBadge
                    icon={Building2}
                    label="Connected Banks"
                    value={`${totalBanks} account${totalBanks !== 1 ? 's' : ''}`}
                    positive
                />
                <StatBadge
                    icon={TrendingDown}
                    label="Spent This Month"
                    value="$1,284.50"
                />
                <StatBadge
                    icon={CreditCard}
                    label="Pending Txns"
                    value="3 transfers"
                    positive
                />
            </div>
        </motion.div>
    )
}

export default BalanceCard
