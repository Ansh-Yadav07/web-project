'use client'

import { motion } from 'framer-motion'
import ActivityFeed from '@/features/transactions/ActivityFeed'

export default function TransactionsPage() {
    return (
        <div className="no-scrollbar flex flex-col gap-6 px-5 sm:px-8 py-6 lg:py-8 overflow-y-auto h-full">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Activity Feed</h1>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Search and filter all transactions
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="glass-card p-5"
            >
                <ActivityFeed showFilters compact={false} />
            </motion.div>
        </div>
    )
}
