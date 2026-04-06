# Demo Auth System — Task Checklist

## Auth Utilities
- [ ] lib/demoAuth.ts — localStorage helpers (login, logout, getUser)

## Login Page
- [ ] app/login/page.tsx — standalone glassmorphism login form

## Route Protection
- [ ] Update app/demo/layout.tsx — check auth, redirect to /login, show user name + logout

## Verification
- [ ] Open /login, sign in as Ayush@gmail.com / 123456
- [ ] Verify redirect to /demo
- [ ] Verify sidebar shows "Welcome, Ayush"
- [ ] Verify logout clears session + redirects to /login
- [ ] Verify /demo/* redirects to /login when not authenticated
