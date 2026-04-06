'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowUpRight,
    ArrowDownLeft,
    ShoppingCart,
    Plane,
    Coffee,
    CreditCard,
    RefreshCw,
    Zap,
} from 'lucide-react'
import Link from 'next/link'
import { formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from '@/lib/utils'

const categoryIcons: Record<string, React.ElementType> = {
    'Food and Drink': Coffee,
    Travel: Plane,
    Shopping: ShoppingCart,
    Transfer: RefreshCw,
    Payment: CreditCard,
    default: Zap,
}

interface ActivityFeedProps {
    transactions: Transaction[]
    appwriteItemId: string
}

const itemVariants = {
    hidden: { opacity: 0, x: 16 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.055, duration: 0.35, ease: 'easeOut' },
    }),
}

const ActivityFeed = ({ transactions, appwriteItemId }: ActivityFeedProps) => {
    const displayTransactions = transactions.slice(0, 8)

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="glass-card p-5 flex flex-col gap-4 h-full"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-base font-semibold text-white">Activity Feed</h2>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {displayTransactions.length} recent transactions
                    </p>
                </div>
                <Link
                    href={`/transaction-history/?id=${appwriteItemId}`}
                    className="view-all-btn"
                >
                    View all
                </Link>
            </div>

            {/* Transaction list */}
            <div className="flex flex-col gap-1">
                <AnimatePresence>
                    {displayTransactions.length === 0 ? (
                        <p className="text-center py-8 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            No transactions yet
                        </p>
                    ) : (
                        displayTransactions.map((txn, i) => {
                            const isDebit = txn.type === 'debit' || formatAmount(txn.amount)[0] === '-'
                            const Icon = categoryIcons[txn.category] ?? categoryIcons.default
                            const amount = formatAmount(txn.amount)
                            const status = getTransactionStatus(new Date(txn.date))

                            return (
                                <motion.div
                                    key={txn.id}
                                    custom={i}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="flex items-center gap-3 p-3 rounded-xl group transition-all cursor-default"
                                    style={{
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.04)',
                                    }}
                                    whileHover={{
                                        background: 'rgba(255,255,255,0.06)',
                                        borderColor: isDebit
                                            ? 'rgba(239,68,68,0.2)'
                                            : 'rgba(16,185,129,0.2)',
                                    }}
                                >
                                    {/* Category icon */}
                                    <div
                                        className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                                        style={{
                                            background: isDebit
                                                ? 'rgba(239,68,68,0.12)'
                                                : 'rgba(16,185,129,0.12)',
                                        }}
                                    >
                                        <Icon
                                            className={`size-4 ${isDebit ? 'text-red-400' : 'text-emerald-400'}`}
                                        />
                                    </div>

                                    {/* Name & date */}
                                    <div className="flex flex-1 flex-col min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            {removeSpecialCharacters(txn.name)}
                                        </p>
                                        <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.38)' }}>
                                            {formatDateTime(new Date(txn.date)).dateTime}
                                        </p>
                                    </div>

                                    {/* Amount + status */}
                                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                                        <span
                                            className={`text-sm font-semibold ${isDebit ? 'text-red-400' : 'text-emerald-400'}`}
                                        >
                                            {isDebit && amount[0] !== '-' ? `-${amount}` : amount}
                                        </span>
                                        <span
                                            className="text-[10px] font-medium rounded-full px-1.5 py-0.5"
                                            style={{
                                                background:
                                                    status === 'Success'
                                                        ? 'rgba(16,185,129,0.15)'
                                                        : 'rgba(245,158,11,0.15)',
                                                color:
                                                    status === 'Success' ? '#34d399' : '#fbbf24',
                                            }}
                                        >
                                            {status}
                                        </span>
                                    </div>
                                </motion.div>
                            )
                        })
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export default ActivityFeed
