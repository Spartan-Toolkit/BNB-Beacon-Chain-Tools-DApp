import { getNetwork } from "../utils/network";
import {
  updateError,
  updateChainId,
  updateWalletType,
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
        // TODO: RUN LOGIC PER WALLET TO DERIVE LIST OF ADDRESSES AFTER UNLOCKING
        // TODO: BINANCEWALLET HAS A COMPLEX OBJECT & INCLUDES BSC ADDRESSES ETC SO WILL REQUIRE PARSING
        // TODO: WALLETCONNECT WILL NEED CHECKING BUT I SUSPECT IT WILL LIST ALL DERIVED COMPATIBLE WALLETS
        // TODO: LEDGER WILL REQUIRE SOME INTERACTION FROM THE USER AND PAGINATION (DERIVE 10 AT A TIME?) AS IT IS AGNOSTIC
        // TODO (LEDGER CONT.): TO WHETHER USER HAS INTERACVTED/DERIVED THE WALLET, SHOWING A BNB BALANCE WILL HELP!
        if (walletType === "BW") {
          updateBW(network, dispatch, updateError);
        } else if (walletType === "WC") {
          updateWC();
        } else if (walletType === "LEDGER") {
          updateLedger();
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
    // Check old code below and pad this out
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

// /** Clear wallet */
// export const clearTheWallet = () => async (dispatch) => {
//   try {
//     dispatch(clearWallet());
//   } catch (error) {
//     dispatch(updateError(error.reason));
//   }
// };

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
