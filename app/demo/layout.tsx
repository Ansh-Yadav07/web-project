'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    LayoutDashboard, BarChart2, Activity, Sparkles,
    Zap, CreditCard, LogOut, ArrowLeftRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getDemoUser, logoutDemo, type DemoUser } from '@/lib/demoAuth'
import { ToastProvider } from '@/components/ToastProvider'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', route: '/demo' },
    { icon: BarChart2, label: 'Analytics', route: '/demo/analytics' },
    { icon: Activity, label: 'Transactions', route: '/demo/transactions' },
    { icon: ArrowLeftRight, label: 'Transfer', route: '/demo/transfer' },
    { icon: Sparkles, label: 'AI Insights', route: '/demo/ai-insights' },
    { icon: CreditCard, label: 'Connections', route: '/demo/api-status' },
]

export default function DemoLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<DemoUser | null>(null)
    const [authChecked, setAuthChecked] = useState(false)

    useEffect(() => {
        const u = getDemoUser()
        if (!u) {
            router.replace('/login')
        } else {
            setUser(u)
            setAuthChecked(true)
        }
    }, [router])

    const handleLogout = () => {
        logoutDemo()
        router.replace('/login')
    }

    if (!authChecked) {
        return (
            <div
                className="flex min-h-screen w-full items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0B1220 0%, #111827 100%)' }}
            >
                <div className="flex flex-col items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl"
                        style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }}>
                        <Zap className="size-5 text-white animate-pulse" />
                    </div>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Loading…</p>
                </div>
            </div>
        )
    }

    return (
        <div
            className="flex h-screen w-full overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0B1220 0%, #111827 100%)', fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            {/* Blue glow blobs */}
            <div className="fixed top-[-150px] left-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />
            <div className="fixed bottom-[-120px] right-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.08) 0%, transparent 70%)' }} />

            {/* ── Sidebar ── */}
            <aside
                className="relative z-10 hidden md:flex flex-col justify-between h-screen w-[220px] xl:w-[240px] shrink-0 py-6 px-4"
                style={{
                    background: 'rgba(11,18,32,0.85)',
                    backdropFilter: 'blur(24px)',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                <div>
                    {/* Logo */}
                    <Link href="/demo" className="flex items-center gap-2.5 mb-8 px-1">
                        <div className="flex size-8 items-center justify-center rounded-lg shrink-0"
                            style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }}>
                            <Zap className="size-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold"
                                style={{
                                    background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                }}>
                                Zensync
                            </p>
                            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Banking Platform</p>
                        </div>
                    </Link>

                    {/* Nav */}
                    <nav className="flex flex-col gap-1">
                        {navItems.map((item, i) => {
                            const isActive = pathname === item.route
                            const Icon = item.icon
                            return (
                                <motion.div
                                    key={item.route}
                                    initial={{ opacity: 0, x: -14 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.055 }}
                                >
                                    <Link
                                        href={item.route}
                                        className={cn(
                                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                                            isActive ? 'text-white' : 'text-white/45 hover:text-white hover:bg-blue-500/5'
                                        )}
                                        style={isActive ? {
                                            background: 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(29,78,216,0.12))',
                                            border: '1px solid rgba(59,130,246,0.3)',
                                            boxShadow: '0 0 20px rgba(59,130,246,0.08)',
                                        } : {}}
                                    >
                                        <Icon className={cn('size-4 shrink-0', isActive ? 'text-blue-400' : 'text-white/35')} />
                                        {item.label}
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </nav>
                </div>

                {/* ── User + Sign Out ── */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 rounded-xl p-3"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                            style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }}>
                            {user?.avatar}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                            <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.32)' }}>{user?.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all group hover:bg-red-500/8"
                        style={{ color: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <LogOut className="size-4 text-red-400/60 group-hover:text-red-400 transition-colors" />
                        <span className="group-hover:text-red-300 transition-colors">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* ── Main area ── */}
            <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
                {/* Mobile top bar */}
                <div
                    className="flex md:hidden items-center justify-between px-4 py-3"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(11,18,32,0.9)', backdropFilter: 'blur(16px)' }}
                >
                    <Link href="/demo" className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-lg"
                            style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' }}>
                            <Zap className="size-3.5 text-white" />
                        </div>
                        <span className="text-sm font-bold"
                            style={{
                                background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>Zensync</span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs"
                        style={{ color: 'rgba(255,255,255,0.4)' }}>
                        <LogOut className="size-3.5 text-red-400" /> Sign Out
                    </button>
                </div>

                <ToastProvider>
                    <main className="flex-1 overflow-auto">
                        {children}
                    </main>
                </ToastProvider>
            </div>
        </div>
    )
}
