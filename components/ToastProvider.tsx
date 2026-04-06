'use client'

import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Info, XCircle, X } from 'lucide-react'

// ── Types ───────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number   // ms, default 4000
}

interface ToastContextValue {
    addToast: (t: Omit<Toast, 'id'>) => void
    removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

// ── Hook ────────────────────────────────────────────────────────
export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
    return ctx
}

// ── Individual Toast ────────────────────────────────────────────
const typeConfig: Record<ToastType, { icon: React.ElementType; bg: string; border: string; accent: string; iconColor: string }> = {
    success: {
        icon: CheckCircle,
        bg: 'rgba(11,18,32,0.97)',
        border: 'rgba(16,185,129,0.35)',
        accent: 'rgba(16,185,129,0.08)',
        iconColor: '#34d399',
    },
    error: {
        icon: XCircle,
        bg: 'rgba(11,18,32,0.97)',
        border: 'rgba(239,68,68,0.35)',
        accent: 'rgba(239,68,68,0.08)',
        iconColor: '#f87171',
    },
    info: {
        icon: Info,
        bg: 'rgba(11,18,32,0.97)',
        border: 'rgba(59,130,246,0.35)',
        accent: 'rgba(59,130,246,0.08)',
        iconColor: '#60A5FA',
    },
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
    const config = typeConfig[toast.type]
    const Icon = config.icon

    useEffect(() => {
        const timer = setTimeout(onRemove, toast.duration ?? 4000)
        return () => clearTimeout(timer)
    }, [toast.duration, onRemove])

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 60, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.92 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex items-start gap-3 rounded-2xl p-4 w-80 pointer-events-auto"
            style={{
                background: config.bg,
                border: `1px solid ${config.border}`,
                backdropFilter: 'blur(24px)',
                boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px ${config.border}`,
            }}
        >
            {/* Accent strip */}
            <div className="w-0.5 self-stretch rounded-full shrink-0" style={{ background: config.iconColor }} />

            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl"
                style={{ background: config.accent }}>
                <Icon className="size-4" style={{ color: config.iconColor }} />
            </div>

            <div className="flex flex-1 flex-col min-w-0 gap-0.5">
                <p className="text-sm font-semibold text-white leading-tight">{toast.title}</p>
                {toast.message && (
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.48)' }}>
                        {toast.message}
                    </p>
                )}
            </div>

            <button
                onClick={onRemove}
                className="flex size-6 shrink-0 items-center justify-center rounded-lg transition-all"
                style={{ color: 'rgba(255,255,255,0.28)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'white')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.28)')}
            >
                <X className="size-3.5" />
            </button>
        </motion.div>
    )
}

// ── Provider + Portal ───────────────────────────────────────────
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((t: Omit<Toast, 'id'>) => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`
        setToasts((prev) => [...prev, { ...t, id }])
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            {/* Fixed portal — top-right */}
            <div
                className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none"
                aria-live="assertive"
            >
                <AnimatePresence initial={false} mode="sync">
                    {toasts.map((toast) => (
                        <ToastItem
                            key={toast.id}
                            toast={toast}
                            onRemove={() => removeToast(toast.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}
