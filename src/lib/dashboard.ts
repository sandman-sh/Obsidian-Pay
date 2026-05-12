import { getPrisma } from "@/lib/prisma";
import { getFxRates } from "@/lib/fx";
import { ensureSeedData } from "@/lib/seed";
import { getTreasurySnapshot, getTreasuryWalletAddress } from "@/lib/solana";

export async function getDashboardData() {
  const prisma = getPrisma();
  const org = await ensureSeedData();
  const [organization, employees, payrollRuns, billingEvents] = await Promise.all([
    prisma.organization.findUniqueOrThrow({ where: { id: org.id } }),
    prisma.employee.findMany({
      where: { organizationId: org.id },
      orderBy: { createdAt: "asc" },
    }),
    prisma.payrollRun.findMany({
      where: { organizationId: org.id },
      include: {
        items: {
          include: {
            employee: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.billingEvent.findMany({
      where: { organizationId: org.id },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const fxRates = await getFxRates(employees.map((employee) => employee.nativeCurrency));
  const annualizedUsdCents = employees.reduce(
    (total, employee) => total + employee.monthlySalaryUsdCents * 12,
    0,
  );

  let treasury = null;
  try {
    treasury = await getTreasurySnapshot();
  } catch {
    treasury = {
      wallet: await getTreasuryWalletAddress(),
      sol: 0,
      usdc: 0,
      usdcMint: null,
      usdcDecimals: 6,
    };
  }

  return {
    organization,
    employees,
    payrollRuns,
    billingEvents,
    fxRates,
    annualizedUsdCents,
    treasury,
  };
}
