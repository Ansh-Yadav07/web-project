// ============================================
// ZENSYNC DEMO AUTH — lib/demoAuth.ts
// localStorage-based auth, no external APIs
// ============================================

export interface DemoUser {
    name: string
    email: string
    avatar: string   // first letter of name
}

// ---- Demo credentials (single demo account) ----
const DEMO_CREDENTIALS = [
    { email: 'Ayush@gmail.com', password: '123456', name: 'Ayush' },
    { email: 'ayush@gmail.com', password: '123456', name: 'Ayush' }, // case-insensitive fallback
]

const STORAGE_KEY = 'zensync_demo_user'

// ---- Attempt login → returns user or null ----
export function loginDemo(email: string, password: string): DemoUser | null {
    const match = DEMO_CREDENTIALS.find(
        (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    )
    if (!match) return null

    const user: DemoUser = {
        name: match.name,
        email: match.email,
        avatar: match.name[0].toUpperCase(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return user
}

// ---- Get current session user ----
export function getDemoUser(): DemoUser | null {
    if (typeof window === 'undefined') return null
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as DemoUser) : null
    } catch {
        return null
    }
}

// ---- Check if authenticated ----
export function isAuthenticated(): boolean {
    return getDemoUser() !== null
}

// ---- Logout ----
export function logoutDemo(): void {
    localStorage.removeItem(STORAGE_KEY)
}
