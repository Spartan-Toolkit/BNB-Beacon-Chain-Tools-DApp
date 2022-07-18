export const updateBW = async (network, dispatch, updateError) => {
  // Check existence of Binance Wallet object
  if (!window.BinanceChain) {
    dispatch(updateError("No Binance Wallet instance detected"));
    return false;
  }
  // Check Binance Wallet's selected network matches DApp
  console.log(
    "TODO: CONFIRM EXPECTED VALUES & UPDATE network.js IDs:",
    window.BinanceChain.chainId
  );
  if (network.idBW !== window.BinanceChain.chainId) {
    // Prompt user to change network to match
    await window.BinanceChain.switchNetwork(network.idBW);
    // If still incorrect, throw error
    if (network.idBW !== window.BinanceChain.chainId) {
      dispatch(updateError("User didnt change network", network.idBW));
      return false;
    }
  }
  return true; // return true if no error and safe to proceed
};

export const updateWC = async (chainId, dispatch, updateError) => {
  // Check existence of Wallet Connect? (Probably not relevant, but maybe check localStorage for pre-existing instance?)
  // Check chainID, make sure its compatible with WC
  return true; // return true if no error and safe to proceed
};

export const updateLedger = async (chainId, dispatch, updateError) => {
  // Check anything relevant to user ++ Ledger device
  // Check chainID, make sure its compatible with Ledger / App
  return true; // return true if no error and safe to proceed
};
