import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { env } from "@/lib/env";

export async function GET(request: NextRequest) {
  const customerId = request.nextUrl.searchParams.get("customer_id");

  if (!env.dodoApiKey) {
    return NextResponse.json(
      { error: "Add DODO_PAYMENTS_API_KEY before using the customer portal." },
      { status: 400 },
    );
  }

  if (!customerId) {
    return NextResponse.json(
      { error: "Pass ?customer_id=... to open the Dodo customer portal." },
      { status: 400 },
    );
  }

  try {
    const client = new DodoPayments({
      bearerToken: env.dodoApiKey,
      environment: env.dodoEnvironment,
    });
    const portal = await client.customers.customerPortal.create(customerId, {
      return_url: env.dodoReturnUrl,
    });

    return NextResponse.redirect(portal.link);
  } catch (issue) {
    return NextResponse.json(
      {
        error:
          issue instanceof Error ? issue.message : "Unable to create portal session.",
      },
      { status: 500 },
    );
  }
}
