import React, { createContext, useEffect, useState } from "react";
import { BncClient } from "@binance-chain/javascript-sdk";
import { getNetwork } from "../utils/network";
import { useBbc } from "..";

export const Context = createContext();

export const BnbClientProvider = ({ children }) => {
  const { chainId, address } = useBbc();

  const [client, setclient] = useState(undefined);

  useEffect(() => {
    if (["bbc-mainnet", "bbc-testnet"].includes(chainId)) {
      const _client = new BncClient(getNetwork(chainId).rpcs[0]);
      _client.initChain();
      _client.chooseNetwork(chainId.split("-")[1]);
      setclient(_client);
    } else {
      // TODO: Add non-beacon handling (conditionally inject this provider???)
      console.log(
        "Invalid chainId or Beacon-Chain not selected (is smart chain selected in DApp?)"
      );
      setclient(undefined);
    }
  }, [chainId]);

  // TODO: Add a useEffect with dep '~bbc.address' to set/update the client if wallet address changes
  useEffect(() => {
    // If user selects a new wallet address, clear the 'account_number'
    // We dont need to set it here (just clear it) because it gets set during the txn building / signing functions
    if (client?.account_number) {
      console.log(
        "User changed selected account in DApp, clearing account_number"
      );
      client.account_number = null;
    }
  }, [address, client]);

  return (
    <Context.Provider value={[client, setclient]}>{children}</Context.Provider>
  );
};
