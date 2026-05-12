<div align="center">
  <img src="./src/app/icon.png" alt="OBSIDIAN PAY Logo" width="100" />

  # OBSIDIAN PAY
  **Premium SaaS for Global Solana Payroll**

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
  [![Solana](https://img.shields.io/badge/Solana-Devnet-14F195?style=flat&logo=solana&logoColor=white)](https://solana.com/)
  [![Dodo Payments](https://img.shields.io/badge/Billing-Dodo_Payments-000000?style=flat)](https://dodopayments.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
</div>

<br />

**OBSIDIAN PAY** is an industrial-grade, borderless payroll operating system designed for modern, distributed teams. It leverages the sub-second speed and near-zero cost of **Solana USDC** for global settlements, seamlessly paired with **Dodo Payments** for robust B2B SaaS subscription billing.

Built with a high-contrast, premium aesthetic—sharp geometric forms and minimalist interfaces—OBSIDIAN PAY strips away the fluff to deliver a powerful, professional financial tool.

---

## ⚡ Core Architecture

OBSIDIAN PAY is built on a hybrid Web2.5 architecture, marrying the best of traditional SaaS monetization with the power of decentralized settlement:

1. **The Web2 Engine (Monetization)**: We utilize **Dodo Payments** to charge employers a SaaS subscription fee. Dodo handles the fiat credit card processing, checkout UI, and global tax compliance (Merchant of Record).
2. **The Web3 Engine (Settlement)**: For the actual payroll, we use the **Solana Blockchain**. Employers fund a treasury with USDC, and payouts are routed instantly to self-custodial employee wallets worldwide, completely bypassing Swift wire delays and FX fees.

## ✨ Key Features

- 🌍 **Global Employee Registry**: Onboard remote teams with structured fiat compensation tiers and Solana wallet addresses.
- 💸 **USDC Treasury Disbursements**: Execute batch payroll runs directly from a Solana Devnet treasury to multiple employee wallets simultaneously.
- 💱 **Live FX Native Quoting**: Employees are paid in stablecoins, but run snapshots capture real-time FX rates (INR, EUR, AED, GBP) via the Frankfurter API for accurate local currency reporting.
- 🛡️ **Audit-Grade Ledgers**: Every single payroll disbursement permanently stores its unique Solana transaction signature for flawless compliance and reconciliation.
- 💳 **Dodo SaaS Billing**: Fully integrated Dodo Payments checkout sessions, automated customer portal routing, and secure webhook ingestion for tracking employer subscriptions.

## 🛠️ Tech Stack

- **Frontend & API**: Next.js 16 (App Router), React 19, TypeScript
- **Design System**: Custom Premium UI (Tailwind CSS v4, pure monochrome base, electric accents, strict geometry)
- **Database**: Prisma ORM with SQLite (`dev.db`)
- **Web3 Integration**: `@solana/web3.js`, `@solana/spl-token`, Phantom Wallet Adapter
- **Billing Infrastructure**: Dodo Payments TypeScript SDK

---

## 🚀 Getting Started

Follow these instructions to run the application locally.

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/sandman-sh/Obsidian-Pay.git
cd Obsidian-Pay
npm install
```

### 2. Environment Configuration

Copy the example environment file and fill in your private keys.

```bash
cp .env.example .env
```

You must configure the following critical keys in your `.env`:

```env
# 1. SOLANA TREASURY WALLET
# Must be a byte array of a Phantom wallet funded with Devnet SOL and Devnet USDC.
SOLANA_TREASURY_SECRET_KEY="[123, 45, 67, ...]"

# 2. DODO PAYMENTS KEYS
DODO_PAYMENTS_API_KEY="sk_test_..."
DODO_PAYMENTS_PRODUCT_ID="pdt_..."
DODO_PAYMENTS_WEBHOOK_KEY="whsec_..."
```

### 3. Database Setup

Push the Prisma schema to synchronize the SQLite database and generate the client:

```bash
npm run db:push
npm run prisma:generate
```

### 4. Start the Dev Server

Launch the application:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 🌐 Important Workflow Notes

- **Devnet Settlement:** The application currently executes transactions against `api.devnet.solana.com`. Employees are paid using the Devnet USDC mint.
- **ATA Generation:** The payout execution sequence automatically derives and funds Associated Token Accounts (ATAs) for new employees upon their first payment.
- **Dodo Webhooks:** To test the billing flow locally, forward Dodo webhooks using tools like **Ngrok** to hit `POST /api/webhooks/dodo` and verify your local `DODO_PAYMENTS_WEBHOOK_KEY`.
