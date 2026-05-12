import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { sendUsdcPayout } from "@/lib/solana";
import { hasTreasuryConfig } from "@/lib/env";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ runId: string }> },
) {
  if (!hasTreasuryConfig()) {
    return NextResponse.json(
      {
        error:
          "Add SOLANA_TREASURY_SECRET_KEY to .env.local with a devnet wallet before sending payroll.",
      },
      { status: 400 },
    );
  }

  const { runId } = await context.params;
  const prisma = getPrisma();
  const run = await prisma.payrollRun.findUnique({
    where: { id: runId },
    include: {
      items: {
        include: {
          employee: true,
        },
      },
    },
  });

  if (!run) {
    return NextResponse.json({ error: "Payroll run not found." }, { status: 404 });
  }

  try {
    for (const item of run.items) {
      if (item.status === "paid") {
        continue;
      }

      const payout = await sendUsdcPayout({
        destinationWallet: item.employee.walletAddress,
        usdAmountCents: item.usdAmountCents,
      });

      await prisma.payrollItem.update({
        where: { id: item.id },
        data: {
          status: "paid",
          txSignature: payout.signature,
        },
      });
    }

    await prisma.payrollRun.update({
      where: { id: run.id },
      data: { status: "paid" },
    });

    return NextResponse.json({
      message: `Executed ${run.items.length} payouts on Solana devnet.`,
    });
  } catch (issue) {
    await prisma.payrollRun.update({
      where: { id: run.id },
      data: { status: "failed" },
    });

    return NextResponse.json(
      {
        error:
          issue instanceof Error ? issue.message : "Failed to execute devnet payout.",
      },
      { status: 500 },
    );
  }
}
