'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Building2, Plus, X, CheckCircle, Wallet, PiggyBank,
    TrendingUp, CreditCard, ChevronRight, Shield, Zap,
} from 'lucide-react'

// ── Mock bank data ─────────────────────────────────────────────
interface BankAccount {
    id: string
    bank: string
    accountType: 'Checking' | 'Savings' | 'Investment'
    balance: number
    accountNumber: string      // last 4 digits shown
    status: 'active' | 'syncing'
    color: string              // accent gradient for the card
    logo: string               // emoji shorthand
    lastSync: string
}

const MOCK_ACCOUNTS: BankAccount[] = [
    {
        id: '1',
        bank: 'Chase Bank',
        accountType: 'Checking',
        balance: 124350,
        accountNumber: '4821',
        status: 'active',
        color: 'linear-gradient(135deg,#1565C0,#0D47A1)',
        logo: '🏦',
        lastSync: '2 min ago',
    },
    {
        id: '2',
        bank: 'HDFC Bank',
        accountType: 'Savings',
        balance: 97800,
        accountNumber: '3390',
        status: 'active',
        color: 'linear-gradient(135deg,#1D4ED8,#1E3A8A)',
        logo: '🏦',
        lastSync: '5 min ago',
    },
    {
        id: '3',
        bank: 'SBI',
        accountType: 'Savings',
        balance: 62200,
        accountNumber: '7712',
        status: 'active',
        color: 'linear-gradient(135deg,#2563EB,#1E40AF)',
        logo: '🏦',
        lastSync: '12 min ago',
    },
    {
        id: '4',
        bank: 'ICICI Bank',
        accountType: 'Checking',
        balance: 45000,
        accountNumber: '5503',
        status: 'syncing',
        color: 'linear-gradient(135deg,#3B82F6,#2563EB)',
        logo: '🏦',
        lastSync: 'Syncing…',
    },
]

const AVAILABLE_BANKS = ['Chase Bank', 'Bank of America', 'Wells Fargo', 'SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank']

const typeIconMap: Record<BankAccount['accountType'], React.ElementType> = {
    Checking: Wallet,
    Savings: PiggyBank,
    Investment: TrendingUp,
}

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

// ── Connect Bank Modal ──────────────────────────────────────────
function ConnectModal({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState<'select' | 'success'>('select')
    const [selected, setSelected] = useState<string | null>(null)

    const handleConnect = () => {
        if (!selected) return
        setStep('success')
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl p-6"
                style={{
                    background: 'rgba(11,18,32,0.98)',
                    border: '1px solid rgba(59,130,246,0.25)',
                    backdropFilter: 'blur(24px)',
                    boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.1)',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl"
                            style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }}>
                            <Building2 className="size-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">
                                {step === 'select' ? 'Connect a Bank' : 'Bank Connected!'}
                            </h3>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
                                {step === 'select' ? 'Select your bank to get started' : 'Your account has been linked'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="flex size-8 items-center justify-center rounded-xl transition-all hover:bg-white/8"
                        style={{ color: 'rgba(255,255,255,0.4)' }}>
                        <X className="size-4" />
                    </button>
                </div>

                {step === 'select' ? (
                    <>
                        {/* Bank grid */}
                        <div className="grid grid-cols-2 gap-2 mb-5">
                            {AVAILABLE_BANKS.map((bank) => (
                                <button
                                    key={bank}
                                    onClick={() => setSelected(bank)}
                                    className="flex items-center gap-2.5 rounded-xl p-3 text-left transition-all"
                                    style={selected === bank
                                        ? { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.4)' }
                                        : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }
                                    }
                                >
                                    <div className="flex size-8 items-center justify-center rounded-lg"
                                        style={{ background: selected === bank ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)' }}>
                                        <Building2 className="size-4" style={{ color: selected === bank ? '#60A5FA' : 'rgba(255,255,255,0.35)' }} />
                                    </div>
                                    <span className="text-xs font-semibold" style={{ color: selected === bank ? 'white' : 'rgba(255,255,255,0.6)' }}>
                                        {bank}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Security note */}
                        <div className="flex items-center gap-2 rounded-xl p-3 mb-4"
                            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                            <Shield className="size-4 text-blue-400 shrink-0" />
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                Bank connections are read-only and encrypted end-to-end.
                            </p>
                        </div>

                        <button
                            onClick={handleConnect}
                            disabled={!selected}
                            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-40"
                            style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', boxShadow: selected ? '0 4px 15px rgba(59,130,246,0.3)' : 'none' }}
                        >
                            {selected ? `Connect ${selected}` : 'Select a bank'}
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-4 py-6">
                        <div className="flex size-16 items-center justify-center rounded-full"
                            style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.3)' }}>
                            <CheckCircle className="size-8 text-emerald-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-base font-bold text-white mb-1">{selected} connected</p>
                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                Your account will be ready shortly. Full integration coming soon.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl px-4 py-2.5"
                            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                            <Zap className="size-3.5 text-blue-400" />
                            <p className="text-xs font-medium" style={{ color: '#60A5FA' }}>
                                Live sync will be enabled when integration launches
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full rounded-xl py-3 text-sm font-semibold text-white"
                            style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }}>
                            Done
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

// ── Single Bank Card ────────────────────────────────────────────
function BankCard({ account, index }: { account: BankAccount; index: number }) {
    const Icon = typeIconMap[account.accountType]
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.35 }}
            className="group relative rounded-2xl p-[1px] cursor-default"
            style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(29,78,216,0.1), rgba(255,255,255,0.05))',
            }}
            whileHover={{ scale: 1.015, transition: { duration: 0.2 } } as any}
        >
            <div
                className="rounded-2xl p-4 h-full flex flex-col gap-3"
                style={{
                    background: 'rgba(11,18,32,0.92)',
                    backdropFilter: 'blur(20px)',
                    transition: 'box-shadow 0.25s ease',
                }}
            >
                {/* Top row — bank name + status */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-xl"
                            style={{ background: account.color, boxShadow: '0 4px 12px rgba(29,78,216,0.35)' }}>
                            <Building2 className="size-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{account.bank}</p>
                            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.38)' }}>
                                ••••{account.accountNumber}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full px-2 py-0.5"
                        style={account.status === 'active'
                            ? { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }
                            : { background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }
                        }>
                        <div className={`size-1.5 rounded-full ${account.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                        <span className="text-[10px] font-semibold capitalize"
                            style={{ color: account.status === 'active' ? '#34d399' : '#fbbf24' }}>
                            {account.status === 'active' ? 'Active' : 'Syncing'}
                        </span>
                    </div>
                </div>

                {/* Balance */}
                <div>
                    <p className="text-[11px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
                        Available Balance
                    </p>
                    <p className="text-xl font-bold text-white">{fmt(account.balance)}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-2"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-1.5">
                        <div className="flex size-5 items-center justify-center rounded-md"
                            style={{ background: 'rgba(59,130,246,0.12)' }}>
                            <Icon className="size-3 text-blue-400" />
                        </div>
                        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
                            {account.accountType}
                        </span>
                    </div>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
                        Synced {account.lastSync}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}

// ── Main ConnectedAccounts Section ─────────────────────────────
export default function ConnectedAccounts() {
    const [showModal, setShowModal] = useState(false)

    const totalBalance = MOCK_ACCOUNTS.reduce((s, a) => s + a.balance, 0)
    const activeCount = MOCK_ACCOUNTS.filter((a) => a.status === 'active').length

    return (
        <>
            <AnimatePresence>
                {showModal && <ConnectModal onClose={() => setShowModal(false)} />}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex flex-col gap-4"
            >
                {/* Section header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <CreditCard className="size-5 text-blue-400" />
                            Connected Accounts
                        </h2>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
                            {activeCount} of {MOCK_ACCOUNTS.length} accounts active
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all group"
                        style={{
                            background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)',
                            boxShadow: '0 4px 15px rgba(59,130,246,0.25)',
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(59,130,246,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(59,130,246,0.25)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
                    >
                        <Plus className="size-4" /> Connect Bank
                    </button>
                </div>

                {/* Total balance card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4"
                    style={{
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(29,78,216,0.08))',
                        border: '1px solid rgba(59,130,246,0.25)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <div>
                        <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                            Total Balance — All Accounts
                        </p>
                        <p className="text-3xl font-bold text-white tracking-tight">{fmt(totalBalance)}</p>
                        <p className="text-xs mt-1 flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
                            <span className="size-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                            Live sync enabled · Updated just now
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 text-right">
                        {[
                            { label: 'Checking Accounts', val: MOCK_ACCOUNTS.filter((a) => a.accountType === 'Checking').reduce((s, a) => s + a.balance, 0) },
                            { label: 'Savings Accounts', val: MOCK_ACCOUNTS.filter((a) => a.accountType === 'Savings').reduce((s, a) => s + a.balance, 0) },
                        ].map((row) => (
                            <div key={row.label}>
                                <p className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{row.label}</p>
                                <p className="text-sm font-bold text-white">{fmt(row.val)}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Bank cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                    {MOCK_ACCOUNTS.map((account, i) => (
                        <BankCard key={account.id} account={account} index={i} />
                    ))}
                </div>

                {/* Manage link */}
                <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        {MOCK_ACCOUNTS.length} banks connected · Data encrypted
                    </p>
                    <button className="flex items-center gap-1 text-xs font-semibold transition-colors"
                        style={{ color: '#60A5FA' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'white' }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#60A5FA' }}>
                        Manage accounts <ChevronRight className="size-3" />
                    </button>
                </div>
            </motion.div>
        </>
    )
}
