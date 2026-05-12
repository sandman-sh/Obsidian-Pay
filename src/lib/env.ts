export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL ?? "file:./dev.db",
  solanaCluster: process.env.SOLANA_CLUSTER ?? "devnet",
  solanaRpcUrl: process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
  solanaUsdcMint:
    process.env.SOLANA_USDC_MINT ?? "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  solanaTreasurySecretKey: process.env.SOLANA_TREASURY_SECRET_KEY ?? "",
  dodoApiKey: process.env.DODO_PAYMENTS_API_KEY ?? "",
  dodoWebhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY ?? "",
  dodoEnvironment:
    (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode" | undefined) ??
    "test_mode",
  dodoReturnUrl:
    process.env.DODO_PAYMENTS_RETURN_URL ?? "http://localhost:3000/billing",
  dodoProductId: process.env.DODO_PAYMENTS_PRODUCT_ID ?? "",
};

export const publicEnv = {
  solanaRpcUrl:
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ??
    process.env.SOLANA_RPC_URL ??
    "https://api.devnet.solana.com",
};

export function hasDodoConfig() {
  return Boolean(env.dodoApiKey && env.dodoProductId);
}

export function hasTreasuryConfig() {
  return Boolean(env.solanaTreasurySecretKey);
}
