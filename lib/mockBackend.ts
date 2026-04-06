// ============================================
// ZENSYNC MOCK BACKEND — lib/mockBackend.ts
// Async API simulation with realistic delays
// (mockData.ts removed — data inlined here)
// ============================================

// ── Inline data ───────────────────────────────────────────────
export type Category =
    | 'Food' | 'Shopping' | 'Transport' | 'Entertainment'
    | 'Health' | 'Travel' | 'Utilities' | 'Other'

export interface MockTransaction {
    id: string
    name: string
    merchant: string
    amount: number
    type: 'credit' | 'debit'
    category: Category
    date: string
    status: 'success' | 'pending' | 'failed'
}

const d = (daysAgo: number) => {
    const dt = new Date(); dt.setDate(dt.getDate() - daysAgo)
    return dt.toISOString().slice(0, 10)
}
const pm = (daysAgo: number) => {
    const dt = new Date(); dt.setMonth(dt.getMonth() - 1); dt.setDate(dt.getDate() - daysAgo)
    return dt.toISOString().slice(0, 10)
}

const mockTransactions: MockTransaction[] = [
    // Current month
    { id: 't01', name: 'Salary Credit', merchant: 'Employer', amount: 85000, type: 'credit', category: 'Other', date: d(2), status: 'success' },
    { id: 't02', name: 'Swiggy', merchant: 'Swiggy', amount: 649, type: 'debit', category: 'Food', date: d(3), status: 'success' },
    { id: 't03', name: 'Amazon Shopping', merchant: 'Amazon', amount: 2900, type: 'debit', category: 'Shopping', date: d(5), status: 'success' },
    { id: 't04', name: 'Uber', merchant: 'Uber', amount: 340, type: 'debit', category: 'Transport', date: d(7), status: 'success' },
    { id: 't05', name: 'Netflix', merchant: 'Netflix', amount: 649, type: 'debit', category: 'Entertainment', date: d(8), status: 'success' },
    { id: 't06', name: 'Apollo Pharmacy', merchant: 'Apollo', amount: 1200, type: 'debit', category: 'Health', date: d(10), status: 'success' },
    { id: 't07', name: 'MakeMyTrip', merchant: 'MakeMyTrip', amount: 4450, type: 'debit', category: 'Travel', date: d(11), status: 'success' },
    { id: 't08', name: 'MSEB Electricity', merchant: 'MSEB', amount: 1820, type: 'debit', category: 'Utilities', date: d(13), status: 'success' },
    { id: 't09', name: 'Zomato', merchant: 'Zomato', amount: 520, type: 'debit', category: 'Food', date: d(15), status: 'success' },
    { id: 't10', name: 'Freelance Payment', merchant: 'Client', amount: 15000, type: 'credit', category: 'Other', date: d(16), status: 'success' },
    // Previous month
    { id: 't11', name: 'Salary Credit', merchant: 'Employer', amount: 85000, type: 'credit', category: 'Other', date: pm(2), status: 'success' },
    { id: 't12', name: 'BigBasket', merchant: 'BigBasket', amount: 3100, type: 'debit', category: 'Food', date: pm(4), status: 'success' },
    { id: 't13', name: 'Myntra', merchant: 'Myntra', amount: 2900, type: 'debit', category: 'Shopping', date: pm(6), status: 'success' },
    { id: 't14', name: 'Ola', merchant: 'Ola', amount: 280, type: 'debit', category: 'Transport', date: pm(8), status: 'success' },
    { id: 't15', name: 'BookMyShow', merchant: 'BookMyShow', amount: 119, type: 'debit', category: 'Entertainment', date: pm(10), status: 'success' },
    { id: 't16', name: 'Travel - Goa', merchant: 'Air India', amount: 1040, type: 'debit', category: 'Travel', date: pm(12), status: 'success' },
    { id: 't17', name: 'BSNL Broadband', merchant: 'BSNL', amount: 799, type: 'debit', category: 'Utilities', date: pm(14), status: 'success' },
]

const monthlyExpensesRaw = [
    { month: 'Nov', income: 85000, expenses: 18200 },
    { month: 'Dec', income: 92000, expenses: 24500 },
    { month: 'Jan', income: 85000, expenses: 21000 },
    { month: 'Feb', income: 85000, expenses: 19800 },
    { month: 'Mar', income: 100000, expenses: 28000 },
    { month: 'Apr', income: 85000, expenses: 12528 },
]

const savingsTips = [
    'Set up an automatic transfer to savings on payday.',
    'Track daily expenses for 30 days to spot hidden leaks.',
    'The 50/30/20 rule: 50% needs, 30% wants, 20% savings.',
    "Cancel subscriptions you haven't used in 3+ months.",
    'Cook at home 4 days a week to cut food expenses by 40%.',
    'Build a 6-month emergency fund before investing.',
    'Round up purchases and save the difference automatically.',
]

// ── Helpers ───────────────────────────────────────────────────
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))
const getMonth = (dateStr: string) => dateStr.slice(0, 7)
const currentMonth = () => new Date().toISOString().slice(0, 7)
const previousMonth = () => { const d = new Date(); d.setMonth(d.getMonth() - 1); return d.toISOString().slice(0, 7) }

// =====================================================================
// 1. fetchTransactions
// =====================================================================
export interface FetchOptions {
    category?: Category | 'All'
    search?: string
    limit?: number
}

export const fetchTransactions = async (opts: FetchOptions = {}): Promise<MockTransaction[]> => {
    await delay(400)
    let results = [...mockTransactions]
    if (opts.category && opts.category !== 'All') results = results.filter((t) => t.category === opts.category)
    if (opts.search) {
        const q = opts.search.toLowerCase()
        results = results.filter((t) =>
            t.name.toLowerCase().includes(q) || t.merchant.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
        )
    }
    if (opts.limit) results = results.slice(0, opts.limit)
    return results
}

// =====================================================================
// 2. getMonthlyStats — bar chart data (6 months)
// =====================================================================
export interface MonthStat { month: string; expenses: number; income: number; savings: number }

export const getMonthlyStats = async (): Promise<MonthStat[]> => {
    await delay(300)
    return monthlyExpensesRaw.map((row) => ({ ...row, savings: row.income - row.expenses }))
}

// =====================================================================
// 3. getCategoryBreakdown — pie chart
// =====================================================================
export interface CategoryBreakdown { category: Category; total: number; percentage: number; count: number }

export const getCategoryBreakdown = async (monthFilter?: string): Promise<CategoryBreakdown[]> => {
    await delay(350)
    const debits = mockTransactions.filter((t) => t.type === 'debit' && (monthFilter ? getMonth(t.date) === monthFilter : true))
    const map: Record<string, { total: number; count: number }> = {}
    for (const t of debits) {
        if (!map[t.category]) map[t.category] = { total: 0, count: 0 }
        map[t.category].total += t.amount; map[t.category].count++
    }
    const grandTotal = Object.values(map).reduce((sum, v) => sum + v.total, 0)
    return Object.entries(map)
        .map(([category, { total, count }]) => ({ category: category as Category, total, count, percentage: Math.round((total / grandTotal) * 100) }))
        .sort((a, b) => b.total - a.total)
}

// =====================================================================
// 4. getDashboardSummary — top stat cards
// =====================================================================
export interface DashboardSummary {
    totalBalance: number; monthlyIncome: number; monthlyExpenses: number
    monthlySavings: number; totalTransactions: number; balanceChange: number
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
    await delay(300)
    const currM = currentMonth(); const prevM = previousMonth()
    const currTxns = mockTransactions.filter((t) => getMonth(t.date) === currM)
    const prevTxns = mockTransactions.filter((t) => getMonth(t.date) === prevM)
    const monthlyIncome = currTxns.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
    const monthlyExpenses = currTxns.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
    const prevExpenses = prevTxns.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
    const balanceChange = prevExpenses > 0 ? Math.round(((monthlyExpenses - prevExpenses) / prevExpenses) * 100) : 0
    return { totalBalance: 284350, monthlyIncome, monthlyExpenses, monthlySavings: monthlyIncome - monthlyExpenses, totalTransactions: currTxns.length, balanceChange }
}

// =====================================================================
// 5. getAIInsights — rule-based analytics
// =====================================================================
export interface AIInsight {
    id: string; type: 'warning' | 'positive' | 'tip' | 'info'; title: string; description: string
    metric?: string; icon: 'trending-up' | 'trending-down' | 'lightbulb' | 'shield' | 'zap'
}

export const getAIInsights = async (): Promise<AIInsight[]> => {
    await delay(500)
    const currM = currentMonth(); const prevM = previousMonth()
    const insights: AIInsight[] = []
    const currDebits = mockTransactions.filter((t) => t.type === 'debit' && getMonth(t.date) === currM)
    const prevDebits = mockTransactions.filter((t) => t.type === 'debit' && getMonth(t.date) === prevM)
    const sumByCategory = (txns: MockTransaction[]) => {
        const map: Record<string, number> = {}
        txns.forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount }); return map
    }
    const currCats = sumByCategory(currDebits); const prevCats = sumByCategory(prevDebits)
    const topCat = Object.entries(currCats).sort((a, b) => b[1] - a[1])[0]
    if (topCat) insights.push({ id: 'i001', type: 'info', title: `Top Spend: ${topCat[0]}`, description: `${topCat[0]} is your highest spending category this month at ₹${topCat[1].toLocaleString('en-IN')}.`, metric: `₹${topCat[1].toLocaleString('en-IN')}`, icon: 'zap' })
    for (const [cat, currAmt] of Object.entries(currCats)) {
        const prevAmt = prevCats[cat] || 0; if (prevAmt === 0) continue
        const pct = Math.round(((currAmt - prevAmt) / prevAmt) * 100)
        if (pct >= 25) insights.push({ id: `i-up-${cat}`, type: 'warning', title: `${cat} up ${pct}%`, description: `You spent ${pct}% more on ${cat} than last month (₹${currAmt.toLocaleString('en-IN')} vs ₹${prevAmt.toLocaleString('en-IN')}).`, metric: `+${pct}%`, icon: 'trending-up' })
        else if (pct <= -20) insights.push({ id: `i-down-${cat}`, type: 'positive', title: `${cat} down ${Math.abs(pct)}%`, description: `Great job! Your ${cat} spending fell by ${Math.abs(pct)}% vs last month. You saved ₹${(prevAmt - currAmt).toLocaleString('en-IN')}.`, metric: `${pct}%`, icon: 'trending-down' })
    }
    const tipIndex = new Date().getDate() % savingsTips.length
    insights.push({ id: 'i-tip', type: 'tip', title: 'Savings Tip', description: savingsTips[tipIndex], icon: 'lightbulb' })
    const currIncome = mockTransactions.filter((t) => t.type === 'credit' && getMonth(t.date) === currM).reduce((s, t) => s + t.amount, 0)
    const totalExpenses = currDebits.reduce((s, t) => s + t.amount, 0)
    const savingsRate = currIncome > 0 ? Math.round(((currIncome - totalExpenses) / currIncome) * 100) : 0
    insights.push({ id: 'i-savings', type: savingsRate >= 30 ? 'positive' : 'info', title: `Savings Rate: ${savingsRate}%`, description: savingsRate >= 30 ? `Excellent! You're saving ${savingsRate}% of your income this month. Keep it up!` : `Your savings rate is ${savingsRate}%. Aim for 30%+ to build long-term wealth.`, metric: `${savingsRate}%`, icon: 'shield' })
    return insights.slice(0, 5)
}
