import { Web3BNBStore } from "../store/store";
import { BnbClientProvider } from "./BnbClientProvider";
import { WCClientProvider } from "./WalletConnectProvider";

export const Web3BNBProvider = ({ children }) => {
  return (
    <Web3BNBStore>
      <WCClientProvider>
        <BnbClientProvider>{children}</BnbClientProvider>
      </WCClientProvider>
    </Web3BNBStore>
  );
};
