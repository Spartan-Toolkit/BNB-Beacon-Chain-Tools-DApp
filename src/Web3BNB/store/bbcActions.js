import { getNetwork } from "../utils/network";
import {
  updateError,
  updateChainId,
  updateWalletType,
  updateAddrArray,
  updateAddress,
  clearWallet,
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
export const bbcUpdateAddress = (walletAddr) => async (dispatch, getState) => {
  try {
    console.log('TODO: Trigger prompt for user to change address in BW, not required for TW or Ledger');
    dispatch(updateAddress(walletAddr));
  } catch (error) {
    dispatch(updateError(error.reason));
  }
};

/** Update Selected Wallet */
export const bbcClearWallet = (walletAddr) => async (dispatch, getState) => {
  try {
    // Check old code below and pad this out
    dispatch(clearWallet(walletAddr));
  } catch (error) {
    dispatch(updateError(error.reason));
  }
};

// ---------------- OLD DELETE BELOW WHEN DONE ----------------

// /** Try connect to Binance Wallet */
// export const selectBinanceWallet =
//   (selectedAddress, network) => async (dispatch) => {
//     try {
//       // Assign 'accountId'
//       const accounts = await window.BinanceChain.requestAccounts();
//       const accountId = getAccountIdFromAddr(accounts, selectedAddress);

//       // Test if accountId === deriving it via BncClient
//       const bncclient = new BncClient(findChainId(network).rpc);
//       console.log(
//         accountId,
//         (await bncclient.getAccount(selectedAddress)).result
//       );

//       // Assign connected client object to 'client'
//       // let client = new BncClient(findChainId(window.BinanceChain.chainId).rpc);
//       // client.chooseNetwork(window.BinanceChain.chainId);
//       // client.initChain();
//       // console.log("connected client:", client);

//       dispatch(
//         updateWalletSelected({
//           accountId,
//           address: selectedAddress,
//           // client,
//         })
//       );
//     } catch (error) {
//       dispatch(updateError(error.reason));
//     }
//   };

// /**
//  * Send a multisend/batch tsf with Binance Wallet as the signing delegate
//  */
// export const multiSendBW = () => async (dispatch, getState) => {
//   const { address } = getState().bbc;
//   if (address) {
//     try {
//       let client = new BncClient(findChainId(window.BinanceChain.chainId).rpc); // create default client
//       client.setSigningDelegate(getSigningDelegateBW()); // set Binance Wallet as the signing delegate
//       await client.initChain();
//       console.log(window.BinanceChain.chainId);
//       client.chooseNetwork(window.BinanceChain.chainId);
//       const account = (await client.getAccount(address)).result;
//       console.log("connected client:", client);
//       const toAddr = account.address;
//       const testTx = await client
//         .transfer(account.address, toAddr, 0.00001, "BNB", "Test memo")
//         .then((response) => {
//           console.log("Response", response);
//         })
//         .catch((error) => {
//           console.error(error);
//         });

//       console.log(testTx);
//       // return this._signingDelegate.call(this, tx, stdSignMsg)
//       // dispatch(());
//     } catch (error) {
//       dispatch(updateError(error.reason));
//     }
//   }
// };
