import React, { createContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { useBbc } from "../store/store";
import { bbcUpdateAddress } from "../store/bbcActions";

export const WCClientContext = createContext();

export const WCClientProvider = ({ children }) => {
  const { chainId, walletType } = useBbc();
  const dispatch = useDispatch();

  const [wcClient, setwcClient] = useState(undefined);

  useEffect(() => {
    if (walletType === "WC") {
      if (["bbc-mainnet", "bsc-mainnet", "bsc-testnet"].includes(chainId)) {
        // Create a connector
        const connector = new WalletConnect({
          bridge: "https://wallet-bridge.binance.org", // Required
          qrcodeModal: QRCodeModal,
        });
        connector.clientMeta.url = "https://www.binance.org"; // Beaconchain is not selectable in the TrustWallet app, this line is a workaround
        if (!connector.connected) {
          connector.createSession(); // Check if connection is already established
          console.log("New WalletConnect session created");
        }
        console.log(connector);
        setwcClient(connector);
      } else {
        console.log(
          "WalletConnect does not support Beaconchain testnet. Select another network in the DApp"
        );
      }
    }
    return () => {
      setwcClient(undefined); // wipe WC client on walletType change
    };
  }, [chainId, walletType]);

  useEffect(() => {
    if (wcClient) {
      // Subscribe to connection events
      wcClient.on("connect", (error, payload) => {
        if (error) {
          throw error;
        }
        const { accounts, chainId } = payload.params[0];
        console.log("WalletConnect connected", accounts, chainId);
        dispatch(bbcUpdateAddress(accounts[0]));
      });

      wcClient.on("session_update", (error, payload) => {
        if (error) {
          throw error;
        }
        const { accounts, chainId } = payload.params[0];
        console.log("WalletConnect session updated", accounts, chainId);
        dispatch(bbcUpdateAddress(accounts[0]));
      });

      wcClient.on("disconnect", (error, payload) => {
        if (error) {
          throw error;
        }
        console.log("WalletConnect disconnected");
      });
    }

    // return () => {
    //   // TODO: Unsubscribe from events?
    // };
  }, [dispatch, wcClient]);

  return (
    <WCClientContext.Provider value={wcClient}>
      {children}
    </WCClientContext.Provider>
  );
};
