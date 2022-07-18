import { Web3BNBStore } from "../store/store";
import { BnbClientProvider } from "./BnbClientProvider";

export const Web3BNBProvider = ({ children }) => {
  return (
    <Web3BNBStore>
      {/* TODO: Add BSC provider && maybe a WalletConnect provider if we need any global WC info state access */}
      <BnbClientProvider>{children}</BnbClientProvider>
    </Web3BNBStore>
  );
};
