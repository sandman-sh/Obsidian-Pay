"use server";

import { addDays, endOfMonth, format } from "date-fns";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import { getFxRates } from "@/lib/fx";
import { ensureSeedData } from "@/lib/seed";

const employeeSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  country: z.string().min(2),
  nativeCurrency: z.string().length(3),
  monthlySalaryUsd: z.coerce.number().positive(),
  bonusUsd: z.coerce.number().min(0),
  department: z.string().min(2),
  title: z.string().min(2),
  walletAddress: z.string().min(32),
});

export async function createEmployee(formData: FormData) {
  const prisma = getPrisma();
  const organization = await ensureSeedData();
  const parsed = employeeSchema.parse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    country: formData.get("country"),
    nativeCurrency: String(formData.get("nativeCurrency") ?? "USD").toUpperCase(),
    monthlySalaryUsd: formData.get("monthlySalaryUsd"),
    bonusUsd: formData.get("bonusUsd"),
    department: formData.get("department"),
    title: formData.get("title"),
    walletAddress: formData.get("walletAddress"),
  });

  await prisma.employee.create({
    data: {
      organizationId: organization.id,
      fullName: parsed.fullName,
      email: parsed.email,
      country: parsed.country,
      nativeCurrency: parsed.nativeCurrency,
      monthlySalaryUsdCents: Math.round(parsed.monthlySalaryUsd * 100),
      bonusUsdCents: Math.round(parsed.bonusUsd * 100),
      department: parsed.department,
      title: parsed.title,
      walletAddress: parsed.walletAddress,
    },
  });

  revalidatePath("/employees");
  revalidatePath("/dashboard");
  revalidatePath("/payroll");
}

export async function createPayrollRun(formData: FormData) {
  const prisma = getPrisma();
  const organization = await ensureSeedData();
  const periodLabel = String(formData.get("periodLabel") ?? "").trim();

  if (!periodLabel) {
    throw new Error("Period label is required.");
  }

  const employees = await prisma.employee.findMany({
    where: { organizationId: organization.id, status: "active" },
  });
  const fxRates = await getFxRates(employees.map((employee) => employee.nativeCurrency));
  const code = `PR-${format(new Date(), "MMM-yyyy").toUpperCase()}-${Math.floor(
    Math.random() * 900 + 100,
  )}`;
  const totalUsdCents = employees.reduce(
    (sum, employee) => sum + employee.monthlySalaryUsdCents + employee.bonusUsdCents,
    0,
  );

  await prisma.payrollRun.create({
    data: {
      organizationId: organization.id,
      code,
      periodLabel,
      status: "review",
      totalUsdCents,
      scheduledFor: addDays(endOfMonth(new Date()), 2),
      items: {
        create: employees.map((employee) => {
          const usdAmountCents =
            employee.monthlySalaryUsdCents + employee.bonusUsdCents;
          const fxRate = fxRates[employee.nativeCurrency] ?? 1;

          return {
            employeeId: employee.id,
            usdAmountCents,
            localAmount: Number(((usdAmountCents / 100) * fxRate).toFixed(2)),
            localCurrency: employee.nativeCurrency,
            fxRate,
            status: "queued",
          };
        }),
      },
    },
  });

  revalidatePath("/payroll");
  revalidatePath("/dashboard");
}
