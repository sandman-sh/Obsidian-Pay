import { addMonths } from "date-fns";
import { getPrisma } from "@/lib/prisma";

let schemaReady: Promise<void> | null = null;
let seedReady: Promise<{ id: string }> | null = null;

async function ensureDatabaseSchema() {
  if (!schemaReady) {
    const prisma = getPrisma();
    schemaReady = (async () => {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Organization" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "slug" TEXT NOT NULL UNIQUE,
          "baseCurrency" TEXT NOT NULL DEFAULT 'USD',
          "billingPlan" TEXT NOT NULL DEFAULT 'Scale',
          "treasuryWallet" TEXT,
          "dodoCustomerId" TEXT,
          "dodoSubscriptionId" TEXT,
          "dodoSubscriptionState" TEXT NOT NULL DEFAULT 'trialing',
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL
        )
      `);
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Employee" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "organizationId" TEXT NOT NULL,
          "fullName" TEXT NOT NULL,
          "email" TEXT NOT NULL UNIQUE,
          "country" TEXT NOT NULL,
          "nativeCurrency" TEXT NOT NULL,
          "monthlySalaryUsdCents" INTEGER NOT NULL,
          "bonusUsdCents" INTEGER NOT NULL DEFAULT 0,
          "department" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "walletAddress" TEXT NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'active',
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL
        )
      `);
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "PayrollRun" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "organizationId" TEXT NOT NULL,
          "code" TEXT NOT NULL UNIQUE,
          "periodLabel" TEXT NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'draft',
          "treasuryWallet" TEXT,
          "totalUsdCents" INTEGER NOT NULL,
          "scheduledFor" DATETIME NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL
        )
      `);
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "PayrollItem" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "payrollRunId" TEXT NOT NULL,
          "employeeId" TEXT NOT NULL,
          "usdAmountCents" INTEGER NOT NULL,
          "localAmount" REAL NOT NULL,
          "localCurrency" TEXT NOT NULL,
          "fxRate" REAL NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'queued',
          "txSignature" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL
        )
      `);
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "BillingEvent" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "organizationId" TEXT NOT NULL,
          "sourceId" TEXT,
          "eventType" TEXT NOT NULL,
          "status" TEXT NOT NULL,
          "amountUsdCents" INTEGER,
          "notes" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
    })();
  }

  await schemaReady;
}

export async function ensureSeedData() {
  if (seedReady) {
    const seeded = await seedReady;
    return getPrisma().organization.findUniqueOrThrow({ where: { id: seeded.id } });
  }

  const prisma = getPrisma();
  seedReady = (async () => {
    await ensureDatabaseSchema();

    const existing = await prisma.organization.findUnique({
      where: { slug: "obsidian-pay" },
    });

    if (existing) {
      return { id: existing.id };
    }

    try {
      const organization = await prisma.organization.create({
        data: {
          name: "OBSIDIAN PAY",
          slug: "obsidian-pay",
          billingPlan: "Scale",
          dodoSubscriptionState: "trialing",
          treasuryWallet: "Configure SOLANA_TREASURY_SECRET_KEY to load the treasury wallet",
          employees: {
            create: [
              {
                fullName: "Aarav Mehta",
                email: "aarav@obsidianpay.dev",
                country: "India",
                nativeCurrency: "INR",
                monthlySalaryUsdCents: 220000,
                bonusUsdCents: 20000,
                department: "Engineering",
                title: "Senior Solana Engineer",
                walletAddress: "9wFFyRfZBsu2wN8r3u9Qe8Qj7hPWr5q9o6Y6yk5UoQkF",
              },
              {
                fullName: "Maya Brooks",
                email: "maya@obsidianpay.dev",
                country: "United States",
                nativeCurrency: "USD",
                monthlySalaryUsdCents: 340000,
                bonusUsdCents: 30000,
                department: "Operations",
                title: "Payroll Operations Lead",
                walletAddress: "4Nd1m8zXn6S87o9QJ6yX4eP3r8w1jKrX9Hnqs3QpS9Fv",
              },
              {
                fullName: "Sara Al Falasi",
                email: "sara@obsidianpay.dev",
                country: "United Arab Emirates",
                nativeCurrency: "AED",
                monthlySalaryUsdCents: 280000,
                bonusUsdCents: 25000,
                department: "Finance",
                title: "Global Finance Partner",
                walletAddress: "8fj3JgJor7sSV1mGJdoSxYkNQ6bgfMh4gE93LQmB7y8X",
              },
            ],
          },
          billingEvents: {
            create: [
              {
                eventType: "subscription.active",
                status: "trialing",
                amountUsdCents: 4900,
                notes: "Demo organization created with Dodo test-mode posture.",
              },
            ],
          },
          payrollRuns: {
            create: [
              {
                code: "PR-APR-2026",
                periodLabel: "April 2026 Payroll",
                status: "paid",
                totalUsdCents: 895000,
                scheduledFor: addMonths(new Date(), -1),
                items: {
                  create: [],
                },
              },
            ],
          },
        },
      });

      return { id: organization.id };
    } catch {
      const organization = await prisma.organization.findUniqueOrThrow({
        where: { slug: "obsidian-pay" },
      });

      return { id: organization.id };
    }
  })();

  const seeded = await seedReady;
  return prisma.organization.findUniqueOrThrow({ where: { id: seeded.id } });
}
