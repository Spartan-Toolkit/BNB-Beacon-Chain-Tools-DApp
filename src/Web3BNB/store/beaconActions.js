import { findChainId, getAccountIdFromAddr } from "../helpers";
import {
  updateError,
  updateWalletType,
  updateWalletSelected,
  clearWallet,
} from "./beacon";

/** Try connect to Binance Wallet */
export const connectBinanceWallet = (chainIdDescriptor) => async (dispatch) => {
  try {
    // Check existence of Binance Wallet object
    if (!window.BinanceChain) {
      dispatch(updateError("No Binance Wallet instance detected"));
      return;
    }

    // Check chainId is valid
    const chainId = findChainId(chainIdDescriptor);
    if (!chainId) {
      dispatch(updateError("invalid chain ID", chainId));
      return;
    }

    // Check Binance Wallet's selected network matches DApp
    if (chainId.id !== window.BinanceChain.chainId) {
      // Prompt user to change network to match
      await window.BinanceChain.switchNetwork(chainId.id2);
      // If still incorrect, throw error
      if (chainId.id !== window.BinanceChain.chainId) {
        dispatch(updateError("User didnt change network", chainId));
        return;
      }
    }

    dispatch(
      updateWalletType({
        chainId,
        walletType: "BW",
      })
    );
  } catch (error) {
    dispatch(updateError(error.reason));
  }
};

/** Try connect to Binance Wallet */
export const selectBinanceWallet = (selectedAddress) => async (dispatch) => {
  try {
    // Assign 'accountId'
    const accounts = await window.BinanceChain.requestAccounts();
    const accountId = getAccountIdFromAddr(accounts, selectedAddress);

    // Assign connected client object to 'client'
    // let client = new BncClient(findChainId(window.BinanceChain.chainId).rpc);
    // client.chooseNetwork(window.BinanceChain.chainId);
    // client.initChain();
    // console.log("connected client:", client);

    dispatch(
      updateWalletSelected({
        accountId,
        address: selectedAddress,
        // client,
      })
    );
  } catch (error) {
    dispatch(updateError(error.reason));
  }
};

/** Clear wallet */
export const clearTheWallet = () => async (dispatch) => {
  try {
    dispatch(clearWallet());
  } catch (error) {
    dispatch(updateError(error.reason));
  }
};
