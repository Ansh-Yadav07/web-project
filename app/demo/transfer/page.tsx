'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    ArrowRight, Send, AlertCircle, CheckCircle, Loader2,
    Wallet, User, IndianRupee,
} from 'lucide-react'
import { getDemoUser } from '@/lib/demoAuth'
import {
    getUserById, getOtherUsers, executeTransfer,
    type ZUser, type ZTransaction,
} from '@/lib/userStore'
import { useToast } from '@/components/ToastProvider'

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

type TransferStep = 'form' | 'processing' | 'success'

export default function TransferPage() {
    const router = useRouter()
    const { addToast } = useToast()

    const [sender, setSender] = useState<ZUser | null>(null)
    const [recipients, setRecipients] = useState<{ id: string; name: string; email: string }[]>([])
    const [selectedId, setSelectedId] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [note, setNote] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [step, setStep] = useState<TransferStep>('form')
    const [lastTxn, setLastTxn] = useState<ZTransaction | null>(null)

    const loadUserData = useCallback(() => {
        const session = getDemoUser()
        if (!session) { router.replace('/login'); return }
        // Match session email to store user
        const allUsers = [
            getUserById('user_ayush'),
            getUserById('user_ansh'),
        ].filter(Boolean) as ZUser[]
        const me = allUsers.find((u) => u.email.toLowerCase() === session.email.toLowerCase())
        if (me) {
            setSender(me)
            setRecipients(getOtherUsers(me.id))
            if (!selectedId && getOtherUsers(me.id).length > 0) {
                setSelectedId(getOtherUsers(me.id)[0].id)
            }
        }
    }, [router, selectedId])

    useEffect(() => {
        loadUserData()
    }, [loadUserData])

    const handleTransfer = () => {
        setError('')
        const amt = parseFloat(amount)
        if (!sender) return
        if (!selectedId) { setError('Please select a recipient.'); return }
        if (!amount || isNaN(amt) || amt <= 0) { setError('Enter a valid amount.'); return }
        if (amt > sender.account.balance) { setError('Insufficient balance.'); return }

        setStep('processing')

        setTimeout(() => {
            const result = executeTransfer(sender.id, selectedId, amt)
            if (!result.success) {
                setError(result.error ?? 'Transfer failed.')
                setStep('form')
                addToast({ type: 'error', title: 'Transfer failed', message: result.error })
                return
            }

            // Reload sender to get updated txn
            const updated = getUserById(sender.id)
            const txn = updated?.account.transactions.find((t) => t.id === result.senderTxnId) ?? null
            const recipientName = recipients.find((r) => r.id === selectedId)?.name ?? 'User'

            setLastTxn(txn)
            setSender(updated)
            setStep('success')

            addToast({
                type: 'success',
                title: `${fmt(amt)} sent to ${recipientName}`,
                message: 'Transfer completed successfully',
                duration: 5000,
            })
        }, 1500)
    }

    const reset = () => {
        setStep('form')
        setAmount('')
        setNote('')
        setError('')
        loadUserData()
    }

    if (!sender) return null

    return (
        <div className="no-scrollbar flex flex-col gap-6 px-5 sm:px-8 py-6 lg:py-8 overflow-y-auto h-full max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Transfer Funds</h1>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
                    Send money instantly between accounts
                </p>
            </motion.div>

            {step === 'form' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                    {/* Sender info */}
                    <div className="glass-card p-4 flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                            style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }}>
                            <User className="size-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'rgba(255,255,255,0.38)' }}>From</p>
                            <p className="text-sm font-bold text-white">{sender.name}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>{sender.email}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Balance</p>
                            <p className="text-base font-bold text-emerald-400">{fmt(sender.account.balance)}</p>
                        </div>
                    </div>

                    {/* Recipient */}
                    <div className="glass-card p-4 flex flex-col gap-3">
                        <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'rgba(255,255,255,0.38)' }}>
                            To
                        </label>
                        <div className="flex flex-col gap-2">
                            {recipients.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => setSelectedId(r.id)}
                                    className="flex items-center gap-3 rounded-xl p-3 transition-all text-left"
                                    style={selectedId === r.id
                                        ? { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.4)' }
                                        : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }
                                    }
                                >
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                                        style={{ background: selectedId === r.id ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.06)', color: selectedId === r.id ? '#60A5FA' : 'rgba(255,255,255,0.5)' }}>
                                        {r.name[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: selectedId === r.id ? 'white' : 'rgba(255,255,255,0.7)' }}>{r.name}</p>
                                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{r.email}</p>
                                    </div>
                                    {selectedId === r.id && (
                                        <div className="ml-auto flex size-5 items-center justify-center rounded-full"
                                            style={{ background: 'rgba(59,130,246,0.2)' }}>
                                            <CheckCircle className="size-3.5 text-blue-400" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="glass-card p-4 flex flex-col gap-3">
                        <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'rgba(255,255,255,0.38)' }}>
                            Amount
                        </label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-blue-400" />
                            <input
                                type="number"
                                min={1}
                                max={sender.account.balance}
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => { setAmount(e.target.value); setError('') }}
                                className="w-full rounded-xl pl-10 pr-4 py-3.5 text-lg font-bold text-white outline-none"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                                onFocus={(e) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)' }}
                                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
                            />
                        </div>
                        {/* Quick amounts */}
                        <div className="flex gap-2 flex-wrap">
                            {[500, 1000, 2000, 5000, 10000].map((q) => (
                                <button key={q}
                                    onClick={() => setAmount(String(q))}
                                    className="rounded-lg px-2.5 py-1 text-xs font-semibold transition-all"
                                    style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#60A5FA' }}>
                                    {fmt(q)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Note (optional) */}
                    <div className="glass-card p-4 flex flex-col gap-3">
                        <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'rgba(255,255,255,0.38)' }}>
                            Note <span style={{ color: 'rgba(255,255,255,0.2)' }}>(optional)</span>
                        </label>
                        <input
                            type="text"
                            placeholder="What's this for?"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                            onFocus={(e) => { e.target.style.borderColor = 'rgba(59,130,246,0.4)' }}
                            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.07)' }}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 rounded-xl p-3"
                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                            <AlertCircle className="size-4 text-red-400 shrink-0" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={handleTransfer}
                        disabled={!amount || !selectedId}
                        className="flex items-center justify-center gap-2.5 rounded-2xl py-4 text-base font-bold text-white transition-all disabled:opacity-40"
                        style={{
                            background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)',
                            boxShadow: '0 8px 24px rgba(59,130,246,0.3)',
                        }}
                        onMouseEnter={(e) => { if (!e.currentTarget.disabled) { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(59,130,246,0.45)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' } }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(59,130,246,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
                    >
                        <Send className="size-4" />
                        {amount && !isNaN(Number(amount)) && Number(amount) > 0
                            ? `Send ${fmt(Number(amount))}`
                            : 'Transfer Funds'}
                        <ArrowRight className="size-4" />
                    </button>
                </motion.div>
            )}

            {step === 'processing' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 flex flex-col items-center gap-5"
                >
                    <div className="flex size-16 items-center justify-center rounded-full"
                        style={{ background: 'rgba(59,130,246,0.12)', border: '2px solid rgba(59,130,246,0.3)' }}>
                        <Loader2 className="size-8 text-blue-400 animate-spin" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-white">Processing Transfer</p>
                        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Verifying and transferring funds…</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl px-4 py-2"
                        style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                        <div className="size-1.5 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-xs font-medium text-blue-300">Encrypted transfer in progress</span>
                    </div>
                </motion.div>
            )}

            {step === 'success' && lastTxn && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-8 flex flex-col items-center gap-5"
                >
                    <div className="flex size-16 items-center justify-center rounded-full"
                        style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.3)' }}>
                        <CheckCircle className="size-8 text-emerald-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">{lastTxn.message}</p>
                        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            {new Date(lastTxn.date).toLocaleString('en-IN')}
                        </p>
                    </div>
                    {/* Receipt */}
                    <div className="w-full flex flex-col gap-2 rounded-2xl p-4"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {[
                            { label: 'Transaction ID', value: lastTxn.id },
                            { label: 'Status', value: <span className="text-amber-400 font-semibold">Processing → Success in ~1.5s</span> },
                            { label: 'From', value: sender.name },
                            { label: 'To', value: recipients.find((r) => r.id === selectedId)?.name ?? '—' },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between">
                                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
                                <span className="text-xs font-mono text-white">{value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3 w-full">
                        <button onClick={reset}
                            className="flex-1 rounded-xl py-3 text-sm font-semibold transition-all"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                            New Transfer
                        </button>
                        <button onClick={() => router.push('/demo')}
                            className="flex-1 rounded-xl py-3 text-sm font-bold text-white"
                            style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }}>
                            Back to Dashboard
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Recent transfers from store */}
            {step === 'form' && sender.account.transactions.filter((t) => t.type === 'sent' || t.type === 'received').length > 0 && (
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
                    <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Wallet className="size-4 text-blue-400" /> Transfer History
                    </h2>
                    <div className="flex flex-col gap-2">
                        {sender.account.transactions
                            .filter((t) => t.type === 'sent' || t.type === 'received')
                            .slice(0, 5)
                            .map((t) => (
                                <div key={t.id}
                                    className="flex items-center justify-between rounded-xl p-3"
                                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div>
                                        <p className="text-sm font-medium text-white">{t.message}</p>
                                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                            {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} · {t.status}
                                        </p>
                                    </div>
                                    <span className={`text-sm font-bold ${t.type === 'sent' ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {t.type === 'sent' ? '-' : '+'}{fmt(t.amount)}
                                    </span>
                                </div>
                            ))}
                    </div>
                </motion.div>
            )}
        </div>
    )
}
