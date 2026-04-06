<div align="center">
  <br />
  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Appwrite-black?style=for-the-badge&logoColor=white&logo=appwrite&color=FD366E" alt="appwrite" />
  </div>

  <h3 align="center">Zensync: Modern Banking Platform</h3>
</div>

## 📋 Table of Contents

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)

## <a name="introduction">🤖 Introduction</a>

Built with Next.js, Zensync is a modern fintech dashboard that provides a unified interface for managing financial data. The platform focuses on a clean UI, analytics, and user experience by simulating banking features such as account management, transaction tracking, and financial insights.

## <a name="tech-stack">⚙️ Tech Stack</a>

- **Framework**: Next.js
- **Language**: TypeScript
- **Backend as a Service**: Appwrite
- **Forms & Validation**: React Hook Form, Zod
- **Styling**: TailwindCSS, ShadCN UI
- **Data Visualization**: Chart.js

## <a name="features">🔋 Features</a>

👉 **Authentication (Demo-Based)**: Lightweight authentication system using local storage to simulate user sessions.

👉 **Dashboard Overview**: Displays total balance, connected accounts, recent transactions, and analytics in a clean UI.

👉 **Multi-Bank Simulation**: Shows multiple bank accounts using structured mock data to represent real-world banking scenarios.

👉 **Transaction Management**: View transaction history with filtering and categorization.

👉 **Analytics & Insights**: Visual charts and AI-based insights to analyze spending patterns.

👉 **Funds Transfer (Simulated)**: UI-based transfer functionality to demonstrate transaction workflows.

👉 **Modern UI/UX**: Dark theme with blue glassmorphism design for a premium fintech experience.

👉 **Responsiveness**: Fully responsive design across desktop, tablet, and mobile devices.

---

## 👥 Multi-User System

- Supports multiple users with independent sessions  
- Each user has:
  - Separate account balance  
  - Individual transaction history  

---

## 💸 Fund Transfer (Simulated)

- Transfer money between users  
- Real-time balance updates  
- Dual transaction records:
  - Sender → "Sent"
  - Receiver → "Received"  

---

## 🔄 Transaction Status Simulation

- Mimics real banking workflow  
- Status flow:
  - Processing → Success  
- Uses delay to simulate real transactions  

---

## 🔔 Notification System

- Real-time toast notifications  
- Sender receives confirmation  
- Receiver gets incoming funds alert  
- Auto-dismiss after a few seconds  

---

## 🎯 Project Scope

This project focuses on:
- UI/UX design  
- System simulation  
- Core banking workflows  

External banking APIs (like Plaid or Dwolla transactions) are **not fully implemented** and are simulated for demonstration purposes.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/Ansh-Yadav07/banking-web.git
cd banking-web
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
#NEXT
NEXT_PUBLIC_SITE_URL=

#APPWRITE
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=
APPWRITE_DATABASE_ID=
APPWRITE_USER_COLLECTION_ID=
APPWRITE_BANK_COLLECTION_ID=
APPWRITE_TRANSACTION_COLLECTION_ID=
APPWRITE_SECRET=

#DWOLLA
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
DWOLLA_ENV=sandbox
```

Replace the placeholder values with your Appwrite credentials. External banking integrations are simulated for demonstration purposes.

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.
