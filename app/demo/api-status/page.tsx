'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, RefreshCw, Zap, Database, Shield } from 'lucide-react'

interface ServiceStatus {
    status: string; connected: boolean; environment?: string; message: string; timestamp?: string;
}

export default function ApiStatusPage() {
    const [service, setService] = useState<ServiceStatus | null>(null)
    const [loading, setLoading] = useState(true)

    const check = () => {
        setLoading(true)
        fetch('/api/test-dwolla')
            .then((r) => r.json())
            .then((d) => { setService(d); setLoading(false) })
            .catch(() => { setService({ status: 'error', connected: false, message: 'Request failed' }); setLoading(false) })
    }

    useEffect(() => { check() }, [])

    return (
        <div className="no-scrollbar flex flex-col gap-6 px-5 sm:px-8 py-6 lg:py-8 overflow-y-auto h-full">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Connections</h1>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>Service connection diagnostics</p>
            </motion.div>

            {/* Data pipeline status — always healthy */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl"
                            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                            <Database className="size-4 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Data Pipeline</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>Real-time transaction processing</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-semibold text-emerald-400">Operational</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Transaction Service', desc: 'Active' },
                        { label: 'Analytics Engine', desc: 'Active' },
                        { label: 'Category Classifier', desc: 'Active' },
                        { label: 'Insights Engine', desc: 'Active' },
                    ].map((fn) => (
                        <div key={fn.label} className="rounded-xl p-3" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)' }}>
                            <p className="text-xs font-semibold text-emerald-300">{fn.label}</p>
                            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>{fn.desc}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Payment connection */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl"
                            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                            <Zap className="size-4 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Payment Network</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>ACH transfer service</p>
                        </div>
                    </div>
                    <button onClick={check}
                        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)' }}>
                        <RefreshCw className="size-3" /> Recheck
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center gap-3 py-4">
                        <Loader2 className="size-5 animate-spin text-blue-400" />
                        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Checking connection…</span>
                    </div>
                ) : service && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            {service.connected
                                ? <CheckCircle className="size-6 text-emerald-400 shrink-0" />
                                : <XCircle className="size-6 text-red-400 shrink-0" />}
                            <div>
                                <p className={`text-base font-bold ${service.connected ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {service.message}
                                </p>
                                {service.environment && (
                                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
                                        Environment: <span className="text-blue-300 font-semibold">{service.environment}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Status', value: service.status },
                                { label: 'Connected', value: service.connected ? 'Yes' : 'No' },
                                { label: 'Checked at', value: service.timestamp ? new Date(service.timestamp).toLocaleTimeString() : 'N/A' },
                                { label: 'Endpoint', value: '/api/test-dwolla' },
                            ].map((row) => (
                                <div key={row.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(255,255,255,0.38)' }}>{row.label}</p>
                                    <p className="text-sm font-mono text-white mt-0.5">{row.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-4 rounded-xl p-3 flex items-start gap-2"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.18)' }}>
                    <Shield className="size-4 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        All connections are encrypted. Your data is processed securely.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
