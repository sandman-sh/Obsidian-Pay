import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getMint,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { env } from "@/lib/env";

export function getSolanaConnection() {
  return new Connection(env.solanaRpcUrl, "confirmed");
}

export function getTreasuryKeypair() {
  if (!env.solanaTreasurySecretKey) {
    throw new Error("Missing SOLANA_TREASURY_SECRET_KEY");
  }

  const secret = JSON.parse(env.solanaTreasurySecretKey) as number[];
  return Keypair.fromSecretKey(Uint8Array.from(secret));
}

export async function getTreasuryWalletAddress() {
  try {
    return getTreasuryKeypair().publicKey.toBase58();
  } catch {
    return null;
  }
}

export async function getTreasurySnapshot() {
  const connection = getSolanaConnection();
  const mint = new PublicKey(env.solanaUsdcMint);
  const treasury = getTreasuryKeypair();
  const treasuryAta = await getAssociatedTokenAddress(mint, treasury.publicKey);
  const [solBalance, usdcMintInfo, usdcAccountInfo] = await Promise.all([
    connection.getBalance(treasury.publicKey),
    getMint(connection, mint),
    connection.getTokenAccountBalance(treasuryAta).catch(() => null),
  ]);

  return {
    wallet: treasury.publicKey.toBase58(),
    sol: solBalance / 1_000_000_000,
    usdc: Number(usdcAccountInfo?.value.uiAmount ?? 0),
    usdcMint: mint.toBase58(),
    usdcDecimals: usdcMintInfo.decimals,
  };
}

export async function sendUsdcPayout(params: {
  destinationWallet: string;
  usdAmountCents: number;
}) {
  const connection = getSolanaConnection();
  const mint = new PublicKey(env.solanaUsdcMint);
  const treasury = getTreasuryKeypair();
  const recipient = new PublicKey(params.destinationWallet);
  const mintInfo = await getMint(connection, mint);

  const sourceAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    treasury,
    mint,
    treasury.publicKey,
  );

  const destinationAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    treasury,
    mint,
    recipient,
  );

  const amount = BigInt(params.usdAmountCents) * BigInt(10_000);
  const instruction = createTransferCheckedInstruction(
    sourceAccount.address,
    mint,
    destinationAccount.address,
    treasury.publicKey,
    amount,
    mintInfo.decimals,
  );

  const transaction = new Transaction().add(instruction);
  const signature = await sendAndConfirmTransaction(connection, transaction, [treasury]);

  return {
    signature,
    destinationAta: destinationAccount.address.toBase58(),
  };
}
