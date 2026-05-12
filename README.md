# OBSIDIAN PAY

**Premium SaaS for Global Solana Payroll**

OBSIDIAN PAY is an industrial-grade, borderless payroll operating system designed for distributed teams. It leverages the speed and low cost of Solana devnet for USDC settlements, paired seamlessly with Dodo Payments for robust SaaS subscription billing.

Built with a high-contrast, premium aesthetic—sharp geometric forms and electric accents—OBSIDIAN PAY strips away the fluff to deliver a powerful, professional financial tool.

Built on Solana, powered by Dodo Payments.

## Features

- **Global Employee Registry**: Onboard remote-first teams with defined fiat compensation structures and Solana wallet addresses.
- **USDC Treasury Disbursements**: Execute batch payroll runs directly from a Solana devnet treasury to employee wallets.
- **Live FX Native Quoting**: Employees are paid in USDC but run snapshots capture real-time FX rates (e.g., INR, EUR, AED, GBP) for local currency reporting.
- **Audit-Grade Ledgers**: Every payroll disbursement permanently stores its Solana transaction signature for flawless reconciliation and compliance tracking.
- **Dodo SaaS Billing**: Fully integrated Dodo Payments checkout sessions, customer portal routing, and secure webhook ingestion for employer subscription monetization.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Design System**: Custom Premium UI (Tailwind CSS 4, strict 2px borders, sharp geometric tokens)
- **Database**: Prisma Client + local SQLite (`dev.db`)
- **Blockchain Integration**: `@solana/web3.js` + `@solana/spl-token` (Targeting Devnet)
- **Billing Infrastructure**: Dodo Payments TypeScript SDK

## Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Generate Database Schema**
   ```bash
   npm run prisma:generate
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

The application will launch at `http://localhost:3000`.

## Environment Configuration

To enable the full end-to-end functionality, you must copy `.env.example` to `.env` and provide the following secrets:

```env
# Solana Treasury
# An array of bytes representing the secret key for a devnet wallet funded with SOL and Devnet USDC.
SOLANA_TREASURY_SECRET_KEY="[...]"

# Dodo Payments (Test Mode)
DODO_PAYMENTS_API_KEY="sk_test_..."
DODO_PAYMENTS_PRODUCT_ID="prod_..."
DODO_PAYMENTS_WEBHOOK_KEY="whsec_..."
```

## Important Workflow Notes

- **Devnet Settlement:** By default, the application executes transactions against `api.devnet.solana.com`. Employees are paid using the devnet USDC mint (`4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`).
- **ATA Generation:** The payout execution sequence automatically derives and funds Associated Token Accounts (ATAs) for new employees upon their first payment.
- **Dodo Webhooks:** You can forward Dodo webhooks locally using tools like Ngrok or Stripe CLI to hit `POST /api/webhooks/dodo` and verify your local `DODO_PAYMENTS_WEBHOOK_KEY`.
