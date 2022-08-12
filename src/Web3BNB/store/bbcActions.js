import { getNetwork } from "../utils/network";
import {
  updateError,
  updateChainId,
  updateWalletType,
  updateAddrArray,
  updateAddress,
  clearWallet,
  updateBalances,
} from "./bbc";
import { updateBW, updateLedger, updateWC } from "./bbcUtils";

/** Update ChainId */
export const bbcUpdateChainId = (chainId) => async (dispatch) => {
  try {
    const network = getNetwork(chainId);
    if (network) {
      dispatch(updateChainId(network.id));
    } else {
      dispatch(updateError("Invalid chainId"));
    }
  } catch (error) {
    dispatch(updateError(error.reason));
  }
};

/** Update Wallet Type */
export const bbcUpdateWalletType =
  (walletType) => async (dispatch, getState) => {
    dispatch(updateWalletType(undefined));
    const { chainId } = getState().bbc;
    const network = getNetwork(chainId);
    if (getNetwork(chainId)) {
      let shouldContinue = true;
      try {
        if (walletType === "BW") {
          shouldContinue = await updateBW(
            network,
            dispatch,
            updateError,
            updateAddrArray
          );
        } else if (walletType === "WC") {
          shouldContinue = await updateWC();
        } else if (walletType === "LEDGER") {
          shouldContinue = await updateLedger();
        } else {
          dispatch(updateError("Invalid wallet type"));
          return;
        }
        if (shouldContinue) {
          dispatch(updateWalletType(walletType));
        }
      } catch (error) {
        dispatch(updateError(error.reason));
      }
    }
  };

/** Update Selected Wallet */
export const bbcUpdateAddress = (walletAddr) => async (dispatch) => {
  try {
    console.log(
      "TODO: Trigger prompt for user to change address in BW, not required for TW or Ledger"
    );
    dispatch(updateAddress(walletAddr));
  } catch (error) {
    dispatch(updateError(error.reason));
  }
};

/** Update Selected Wallet */
export const bbcUpdateBalances = (balances) => async (dispatch) => {
  const sortFunc = (a, b) => {
    if (a.symbol < b.symbol) {
      return -1;
    }
    if (a.symbol > b.symbol) {
      return 1;
    }
    return 0;
  };
  try {
    balances.sort(sortFunc);
    dispatch(updateBalances(balances));
  } catch (error) {
    dispatch(updateError(error.reason));
  }
};

/** Update Selected Wallet */
export const bbcClearWallet = (walletAddr) => async (dispatch, getState) => {
  const { walletType } = getState().bbc;
  try {
    if (walletType === "WC") {
      window.localStorage.removeItem("walletconnect");
    }
    dispatch(clearWallet(walletAddr));
  } catch (error) {
    dispatch(updateError(error.reason));
  }
};
