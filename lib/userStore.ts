// ============================================================
// lib/userStore.ts
// localStorage-backed multi-user store for Zensync transfers
// No external APIs — fully offline
// ============================================================

export interface ZTransaction {
    id: string
    type: 'sent' | 'received' | 'credit' | 'debit'
    amount: number
    counterparty: string       // name of other user or merchant
    message: string
    status: 'Processing' | 'Success' | 'Failed'
    date: string               // ISO string
}

export interface ZAccount {
    id: string
    balance: number
    transactions: ZTransaction[]
}

export interface ZUser {
    id: string
    name: string
    email: string
    password: string           // plain-text for demo only
    avatar: string
    account: ZAccount
}

// ── Seed data ──────────────────────────────────────────────────
const SEED_USERS: ZUser[] = [
    {
        id: 'user_ayush',
        name: 'Ayush',
        email: 'Ayush@gmail.com',
        password: '123456',
        avatar: 'A',
        account: {
            id: 'acc_ayush',
            balance: 284350,
            transactions: [
                {
                    id: 'txn_a1',
                    type: 'credit',
                    amount: 75000,
                    counterparty: 'Salary',
                    message: 'Salary Credit',
                    status: 'Success',
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: 'txn_a2',
                    type: 'debit',
                    amount: 1820,
                    counterparty: 'MSEB',
                    message: 'Electricity Bill',
                    status: 'Success',
                    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                },
            ],
        },
    },
    {
        id: 'user_ansh',
        name: 'Ansh',
        email: 'ansh@zensync.com',
        password: '12345',
        avatar: 'N',
        account: {
            id: 'acc_ansh',
            balance: 152000,
            transactions: [
                {
                    id: 'txn_n1',
                    type: 'credit',
                    amount: 60000,
                    counterparty: 'Freelance',
                    message: 'Freelance Payment',
                    status: 'Success',
                    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                },
            ],
        },
    },
]

const STORE_KEY = 'zensync_user_store'

// ── Initialise/load the store ───────────────────────────────────
function loadStore(): ZUser[] {
    if (typeof window === 'undefined') return SEED_USERS
    try {
        const raw = localStorage.getItem(STORE_KEY)
        if (!raw) {
            localStorage.setItem(STORE_KEY, JSON.stringify(SEED_USERS))
            return SEED_USERS
        }
        return JSON.parse(raw) as ZUser[]
    } catch {
        return SEED_USERS
    }
}

function saveStore(users: ZUser[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORE_KEY, JSON.stringify(users))
}

// ── Public API ──────────────────────────────────────────────────

/** Find a user by email (case-insensitive) and password */
export function authenticateUser(email: string, password: string): ZUser | null {
    const users = loadStore()
    return users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    ) ?? null
}

/** Get fresh user data from the store by id */
export function getUserById(id: string): ZUser | null {
    return loadStore().find((u) => u.id === id) ?? null
}

/** Get all users except the one with the given id */
export function getOtherUsers(currentId: string): Pick<ZUser, 'id' | 'name' | 'email'>[] {
    return loadStore()
        .filter((u) => u.id !== currentId)
        .map(({ id, name, email }) => ({ id, name, email }))
}

export interface TransferResult {
    success: boolean
    error?: string
    senderTxnId?: string
    receiverTxnId?: string
}

/**
 * Execute a simulated fund transfer between two users.
 * Both sender and receiver records are updated atomically in localStorage.
 */
export function executeTransfer(
    senderId: string,
    receiverId: string,
    amount: number
): TransferResult {
    const users = loadStore()
    const senderIdx = users.findIndex((u) => u.id === senderId)
    const receiverIdx = users.findIndex((u) => u.id === receiverId)

    if (senderIdx === -1 || receiverIdx === -1) return { success: false, error: 'User not found' }
    if (amount <= 0) return { success: false, error: 'Amount must be greater than zero' }
    if (users[senderIdx].account.balance < amount) {
        return { success: false, error: 'Insufficient balance' }
    }

    const sender = users[senderIdx]
    const receiver = users[receiverIdx]
    const now = new Date().toISOString()
    const senderTxnId = `txn_s_${Date.now()}`
    const receiverTxnId = `txn_r_${Date.now() + 1}`

    // Deduct from sender
    users[senderIdx].account.balance -= amount
    users[senderIdx].account.transactions.unshift({
        id: senderTxnId,
        type: 'sent',
        amount,
        counterparty: receiver.name,
        message: `Sent ₹${amount.toLocaleString('en-IN')} to ${receiver.name}`,
        status: 'Processing',
        date: now,
    })

    // Credit receiver
    users[receiverIdx].account.balance += amount
    users[receiverIdx].account.transactions.unshift({
        id: receiverTxnId,
        type: 'received',
        amount,
        counterparty: sender.name,
        message: `Received ₹${amount.toLocaleString('en-IN')} from ${sender.name}`,
        status: 'Processing',
        date: now,
    })

    saveStore(users)

    // Simulate async status upgrade to "Success" after 1.5s
    setTimeout(() => {
        const fresh = loadStore()
        const si = fresh.findIndex((u) => u.id === senderId)
        const ri = fresh.findIndex((u) => u.id === receiverId)
        if (si !== -1) {
            const t = fresh[si].account.transactions.find((t) => t.id === senderTxnId)
            if (t) t.status = 'Success'
        }
        if (ri !== -1) {
            const t = fresh[ri].account.transactions.find((t) => t.id === receiverTxnId)
            if (t) t.status = 'Success'
        }
        saveStore(fresh)
    }, 1500)

    return { success: true, senderTxnId, receiverTxnId }
}

/** Reset the store to seed data (useful for dev) */
export function resetStore(): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORE_KEY, JSON.stringify(SEED_USERS))
}
