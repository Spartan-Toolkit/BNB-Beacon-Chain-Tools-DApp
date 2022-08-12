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
  const [firstLoad, setfirstLoad] = useState(true);

  const newConnector = () => {
    const connector = new WalletConnect({
      bridge: "https://wallet-bridge.binance.org", // Required
      qrcodeModal: QRCodeModal,
    });
    // Beaconchain is not selectable in the TrustWallet app, this line is a workaround
    connector.clientMeta.url = "https://www.binance.org";
    return connector;
  };

  useEffect(() => {
    if (firstLoad && walletType === "WC") {
      let prevSession = localStorage.getItem("walletconnect");
      if (prevSession) {
        console.log("Trying to restore previous WalletConnect session");
        prevSession = JSON.parse(prevSession);
        const connector = newConnector();
        if (!connector.connected) {
          connector.approveSession(1, connector.accounts); // Check if connection is already established
          console.log("WalletConnect session updated");
        }
        console.log(connector);
        setwcClient(connector);
        console.log(
          "WalletConnect session restored",
          connector.accounts,
          chainId
        );
        dispatch(bbcUpdateAddress(connector.accounts[0]));
      }
    }
  }, [chainId, dispatch, firstLoad, walletType]);

  useEffect(() => {
    if (wcClient && !walletType) {
      wcClient.killSession();
      setwcClient(undefined);
    }
    if (!firstLoad && walletType === "WC" && !wcClient) {
      if (["bbc-mainnet", "bsc-mainnet", "bsc-testnet"].includes(chainId)) {
        // Create a connector
        const connector = newConnector();
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
    setfirstLoad(false);
  }, [chainId, dispatch, firstLoad, walletType, wcClient]);

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
        window.localStorage.removeItem("walletconnect");
        dispatch(bbcUpdateAddress(undefined));
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
