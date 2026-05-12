import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { env, hasDodoConfig } from "@/lib/env";

export async function POST() {
  if (!hasDodoConfig()) {
    return NextResponse.json(
      {
        error:
          "Add DODO_PAYMENTS_API_KEY and DODO_PAYMENTS_PRODUCT_ID to .env.local before launching Dodo checkout.",
      },
      { status: 400 },
    );
  }

  try {
    const client = new DodoPayments({
      bearerToken: env.dodoApiKey,
      environment: env.dodoEnvironment,
    });
    const session = await client.checkoutSessions.create({
      product_cart: [{ product_id: env.dodoProductId, quantity: 1 }],
      return_url: env.dodoReturnUrl,
      short_link: true,
      metadata: {
        app: "obsidian-pay",
        module: "billing",
      },
    });

    return NextResponse.json({ checkoutUrl: session.checkout_url });
  } catch (issue) {
    return NextResponse.json(
      {
        error:
          issue instanceof Error ? issue.message : "Failed to create Dodo checkout session.",
      },
      { status: 500 },
    );
  }
}
