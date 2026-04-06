'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import { PieChart, BarChart2 } from 'lucide-react'

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
)

type ChartView = 'pie' | 'bar'

const SpendingChart = () => {
    const [activeView, setActiveView] = useState<ChartView>('bar')

    const pieData = {
        labels: ['Food & Drink', 'Travel', 'Shopping', 'Bills', 'Entertainment'],
        datasets: [
            {
                data: [32, 18, 24, 15, 11],
                backgroundColor: [
                    'rgba(124,58,237,0.85)',
                    'rgba(79,70,229,0.85)',
                    'rgba(37,99,235,0.85)',
                    'rgba(13,148,136,0.85)',
                    'rgba(236,72,153,0.85)',
                ],
                borderColor: 'rgba(255,255,255,0.06)',
                borderWidth: 2,
                hoverOffset: 6,
            },
        ],
    }

    const barData = {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
            {
                label: 'Expenses ($)',
                data: [1420, 980, 1760, 1280, 1540, 890],
                backgroundColor: [
                    'rgba(124,58,237,0.75)',
                    'rgba(99,49,212,0.75)',
                    'rgba(79,70,229,0.75)',
                    'rgba(60,90,246,0.75)',
                    'rgba(37,99,235,0.75)',
                    'rgba(14,116,246,0.75)',
                ],
                borderRadius: 8,
                borderSkipped: false,
                borderWidth: 0,
            },
        ],
    }

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    color: 'rgba(255,255,255,0.7)',
                    font: { size: 11, family: 'Inter' },
                    padding: 16,
                    usePointStyle: true,
                    pointStyleWidth: 8,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(10,8,25,0.9)',
                borderColor: 'rgba(124,58,237,0.4)',
                borderWidth: 1,
                titleColor: '#fff',
                bodyColor: 'rgba(255,255,255,0.7)',
                callbacks: {
                    label: (ctx: any) => ` ${ctx.label}: ${ctx.raw}%`,
                },
            },
        },
    }

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(10,8,25,0.9)',
                borderColor: 'rgba(124,58,237,0.4)',
                borderWidth: 1,
                titleColor: '#fff',
                bodyColor: 'rgba(255,255,255,0.7)',
                callbacks: {
                    label: (ctx: any) => ` $${ctx.raw.toLocaleString()}`,
                },
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
                ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 } },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.06)', drawBorder: false },
                ticks: {
                    color: 'rgba(255,255,255,0.5)',
                    font: { size: 11 },
                    callback: (v: any) => `$${v}`,
                },
            },
        },
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="glass-card p-5 flex flex-col gap-4"
        >
            {/* Header + toggle */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-base font-semibold text-white">Analytics</h2>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {activeView === 'bar' ? 'Monthly expenses' : 'Spending by category'}
                    </p>
                </div>

                <div className="flex items-center gap-1 rounded-xl p-1"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {([
                        { view: 'bar' as ChartView, Icon: BarChart2, label: 'Bar' },
                        { view: 'pie' as ChartView, Icon: PieChart, label: 'Pie' },
                    ] as const).map(({ view, Icon, label }) => (
                        <button
                            key={view}
                            onClick={() => setActiveView(view)}
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                            style={
                                activeView === view
                                    ? {
                                        background: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
                                        color: '#fff',
                                    }
                                    : { color: 'rgba(255,255,255,0.5)' }
                            }
                        >
                            <Icon className="size-3.5" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="h-[220px]">
                {activeView === 'bar' ? (
                    <Bar data={barData} options={barOptions as any} />
                ) : (
                    <Doughnut data={pieData} options={pieOptions as any} />
                )}
            </div>
        </motion.div>
    )
}

export default SpendingChart
