import { NextRequest, NextResponse } from "next/server";
import {
  handleWebhookPayload,
  verifyWebhookPayload,
} from "@dodopayments/core/webhook";
import { getPrisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { ensureSeedData } from "@/lib/seed";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (!env.dodoWebhookKey) {
    return NextResponse.json(
      { error: "Add DODO_PAYMENTS_WEBHOOK_KEY before receiving webhook events." },
      { status: 400 },
    );
  }

  try {
    const payload = await verifyWebhookPayload({
      webhookKey: env.dodoWebhookKey,
      headers: Object.fromEntries(request.headers.entries()),
      body: rawBody,
    });
    const prisma = getPrisma();
    const organization = await ensureSeedData();

    await handleWebhookPayload(payload, {
      webhookKey: env.dodoWebhookKey,
      onPayload: async (event) => {
        await prisma.billingEvent.create({
          data: {
            organizationId: organization.id,
            sourceId:
              "data" in event && event.data && "payment_id" in event.data
                ? String(event.data.payment_id)
                : null,
            eventType: event.type,
            status:
              "data" in event && event.data && "status" in event.data
                ? String(event.data.status)
                : "received",
            notes: JSON.stringify(event).slice(0, 900),
          },
        });

        if (event.type === "subscription.active") {
          await prisma.organization.update({
            where: { id: organization.id },
            data: { dodoSubscriptionState: "active" },
          });
        }

        if (event.type === "payment.succeeded") {
          await prisma.organization.update({
            where: { id: organization.id },
            data: { dodoSubscriptionState: "healthy" },
          });
        }
      },
    });

    return NextResponse.json({ ok: true });
  } catch (issue) {
    return NextResponse.json(
      {
        error:
          issue instanceof Error ? issue.message : "Webhook verification failed.",
      },
      { status: 400 },
    );
  }
}
