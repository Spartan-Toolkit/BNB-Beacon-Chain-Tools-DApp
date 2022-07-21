import { getAddressesBW } from "../utils/helpers";

export const updateBW = async (
  network,
  dispatch,
  updateError,
  updateAddrArray
) => {
  // Check existence of Binance Wallet object
  if (!window.BinanceChain) {
    dispatch(updateError("No Binance Wallet instance detected"));
    return false;
  }
  // Check Binance Wallet's selected network matches DApp
  if (network.idBW !== window.BinanceChain.chainId) {
    // Prompt user to change network to match
    await window.BinanceChain.switchNetwork(network.id); // Use 'id' here not 'idBW', oddly enough the BinanceWallet chainIds arent consistent between functions
    // If still incorrect, throw error
    if (network.idBW !== window.BinanceChain.chainId) {
      dispatch(updateError("User didnt change network to:", network.id));
      return false;
    }
  }
  // Get Array of Wallets
  const addresses = await getAddressesBW();
  // Update state of addrArray
  dispatch(updateAddrArray(addresses));
  return true; // return true if no error and safe to proceed
};

export const updateWC = async (chainId, dispatch, updateError) => {
  // Check existence of Wallet Connect? (Probably not relevant, but maybe check localStorage for pre-existing instance?)
  // Check chainID, make sure its compatible with WC
  // Get Array of Wallets
  // ie. const addresses = await getAddressesBW();
  // Update state of addrArray
  // ie. dispatch(updateAddrArray(addresses));
  return true; // return true if no error and safe to proceed
};

export const updateLedger = async (chainId, dispatch, updateError) => {
  // Check anything relevant to user ++ Ledger device
  // Check chainID, make sure its compatible with Ledger / App
  // Get Array of Wallets (this may require some UI-wizardry for pagination 10 addresses at a time or similar)
  // SHOWING A BNB BALANCE WILL HELP USER!
  // ie. const addresses = await getAddressesBW();
  // Update state of addrArray
  // ie. dispatch(updateAddrArray(addresses));
  return true; // return true if no error and safe to proceed
};
