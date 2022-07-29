import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { BncClient } from "@binance-chain/javascript-sdk";
import { getNetwork } from "../utils/network";
import { useBbc, bbcUpdateBalances } from "..";
import { getSigningDelegateBW } from "./delegates/BinanceWallet";
import { useDispatch } from "react-redux";
import { getSigningDelegateWC } from "./delegates/WalletConnect";
import { WCClientContext } from "./WalletConnectProvider";

export const BnbClientContext = createContext();

export const BnbClientProvider = ({ children }) => {
  const { chainId, walletType, address } = useBbc();
  const dispatch = useDispatch();
  const wcClient = useContext(WCClientContext);

  const [client, setclient] = useState(undefined);

  const setupClient = useCallback(() => {
    if (["bbc-mainnet", "bbc-testnet"].includes(chainId)) {
      const _client = new BncClient(getNetwork(chainId).rpcs[0]);
      _client.initChain();
      _client.chooseNetwork(chainId.split("-")[1]);
      setclient(_client);
      console.log("client updated", _client);
    } else {
      // TODO: Add non-beacon handling (conditionally inject this provider???)
      console.log(
        "Invalid chainId or Beacon-Chain not selected (is smart chain selected in DApp?)"
      );
      setclient(undefined);
    }
  }, [chainId]);

  const setupSigningDelegate = useCallback(() => {
    const preSignCb = () => {
      console.log(
        "TODO: update the frontend with a parsed txn to ensure its 100% correct (client might have received something different to what the UI sent)",
        client
      );
      // **IMPORTANT** Update the front-end with a parsed version of the pre-signed txn to ensure what is being handed
      // to the client matches what the UI sent. (This will resist bugs such as the one listed below in postSignCb && errCb)
    };
    const postSignCb = () => {
      console.log("TODO: post-sign callback", client);
      // ***IMPORTANT*** BncClient or BinanceWallet has a bug with multisend that exponentially increases the outputs
      // on each successive repeat of the same txn. Wiping the client seems to be the only way of avoiding this
      setupClient();
      setupSigningDelegate();
    };
    const errCb = (err) => {
      console.log("TODO: error callback", err);
      // ***IMPORTANT*** BncClient or BinanceWallet has a bug with multisend that exponentially increases the outputs
      // on each successive repeat of the same txn. Wiping the client seems to be the only way of avoiding this
      setupClient();
      setupSigningDelegate();
    };
    if (walletType === "BW") {
      client.setSigningDelegate(
        getSigningDelegateBW(preSignCb, postSignCb, errCb)
      );
      console.log("Signing delegate set to BW:", client);
    } else if (walletType === "LEDGER") {
      // ***IMPORTANT*** See above inside postSignCb && errCb. Dont use these callbacks when testing to find out if the
      // bug is a BncClient issue or a BinanceWallet caching issue. Should help narrow down prior to locating specific issue
    } else if (walletType === "WC") {
      // ***IMPORTANT*** See above inside postSignCb && errCb. Dont use these callbacks when testing to find out if the
      // bug is a BncClient issue or a BinanceWallet caching issue. Should help narrow down prior to locating specific issue
      client.setSigningDelegate(
        getSigningDelegateWC(preSignCb, postSignCb, errCb, wcClient)
      );
      console.log("Signing delegate set to BW:", client);
    }
  }, [client, setupClient, walletType, wcClient]);

  useEffect(() => {
    setupClient();
  }, [chainId, setupClient]);

  useEffect(() => {
    setupSigningDelegate();
  }, [setupSigningDelegate, walletType]);

  // TODO: Add a useEffect with dep '~bbc.address' to set/update the client if wallet address changes
  useEffect(() => {
    const getAccount = async () => {
      let test = await client.getAccount(address);
      test = test.result.account_number;
      console.log(test);
      return test;
    };
    if (client && address) {
      client.address = address;
      client.account_number = getAccount();
      console.log("client address change", client);
    } else if (client) {
      client.address = null;
      client.account_number = null;
      console.log("client address cleared", client);
    }
  }, [address, client]);

  // Loop balances
  useEffect(() => {
    const getBalances = async () => {
      if (client && address) {
        const balances = await client.getBalance(address);
        dispatch(bbcUpdateBalances(balances));
      }
    };
    const intervalId = setInterval(() => {
      if (client && address) {
        getBalances(); // run on interval
      }
    }, 15000);
    getBalances(); // run on load
    return () => clearInterval(intervalId);
  }, [client, dispatch, address]);

  return (
    <BnbClientContext.Provider value={client}>
      {children}
    </BnbClientContext.Provider>
  );
};
