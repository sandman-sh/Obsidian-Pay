"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function HeaderWalletButton() {
  return (
    <div>
      <WalletMultiButton
        className="!border-2 !border-[var(--border)] !bg-[var(--ink)] !px-4 !py-2 !font-black !text-xs !uppercase !tracking-wider !text-white !shadow-[var(--sh-md)] !transition-transform hover:!-translate-y-0.5 !rounded-none"
      />
    </div>
  );
}
