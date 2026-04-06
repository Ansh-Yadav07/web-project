'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { isAuthenticated } from '@/lib/demoAuth'
import { authenticateUser } from '@/lib/userStore'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isAuthenticated()) router.replace('/demo')
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        await new Promise((r) => setTimeout(r, 750))
        const user = authenticateUser(email, password)
        if (user) {
            // Store minimal session for demoAuth compatibility
            localStorage.setItem('zensync_demo_user', JSON.stringify({
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                id: user.id,
            }))
            router.replace('/demo')
        } else {
            setError('Invalid email or password. Please check your credentials.')
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4"
            style={{ background: 'linear-gradient(135deg, #0B1220 0%, #111827 100%)' }}
        >
            {/* Blue glow blobs */}
            <div className="absolute top-[-150px] left-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)' }} />
            <div className="absolute bottom-[-120px] right-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.10) 0%, transparent 70%)' }} />

            <div className="w-full max-w-md relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 28, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="rounded-2xl p-8"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
                    }}
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
                        className="flex items-center gap-3 mb-8"
                    >
                        <div
                            className="flex size-10 items-center justify-center rounded-xl"
                            style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }}
                        >
                            <Zap className="size-5 text-white" />
                        </div>
                        <div>
                            <p className="text-lg font-bold"
                                style={{
                                    background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                }}>
                                Zensync
                            </p>
                            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Modern Banking Platform</p>
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }} className="mb-7">
                        <h1 className="text-2xl font-bold text-white">Sign In</h1>
                        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                            Sign in to your account to continue
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24 }}
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none transition-all"
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.09)',
                                    }}
                                    onFocus={(e) => { if (!error) e.target.style.borderColor = 'rgba(59,130,246,0.55)' }}
                                    onBlur={(e) => { e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.09)' }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError('') }}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full rounded-xl py-3 pl-10 pr-12 text-sm text-white outline-none transition-all"
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.09)',
                                    }}
                                    onFocus={(e) => { if (!error) e.target.style.borderColor = 'rgba(59,130,246,0.55)' }}
                                    onBlur={(e) => { e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.09)' }}
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                                    style={{ color: showPw ? '#60A5FA' : 'rgba(255,255,255,0.3)' }}>
                                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
                            >
                                <AlertCircle className="size-4 text-red-400 shrink-0" />
                                <p className="text-xs text-red-300">{error}</p>
                            </motion.div>
                        )}

                        {/* Forgot password link */}
                        <div className="flex justify-end">
                            <button type="button" className="text-xs font-medium transition-colors"
                                style={{ color: '#60A5FA' }}>
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all disabled:opacity-70"
                            style={{
                                background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)',
                                boxShadow: '0 4px 15px rgba(59,130,246,0.25)',
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 25px rgba(59,130,246,0.40)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(59,130,246,0.25)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
                        >
                            {loading ? (
                                <><Loader2 className="size-4 animate-spin" /> Signing in…</>
                            ) : 'Sign In'}
                        </button>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
                        className="flex items-center justify-center gap-2 mt-6"
                    >
                        <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
                        <p className="text-xs px-3" style={{ color: 'rgba(255,255,255,0.2)' }}>Secured by Zensync</p>
                        <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
