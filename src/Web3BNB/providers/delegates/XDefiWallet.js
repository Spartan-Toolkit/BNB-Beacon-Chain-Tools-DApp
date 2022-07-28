import { crypto } from '@binance-chain/javascript-sdk'

export const getSigningDelegateXD =
  (preSignCb, postSignCb, errCb) => async (tx, signMsg) => {
    try {
      console.log("begining signer callback");
      // Pre-sign Callback
      preSignCb && preSignCb();
      // TODO: Sign Txn
      // SEE: https://sdk.xdefi.io/docs/HEAD/index.html
      // const { pubKey, signature } = await window.BinanceChain?.bbcSignTx({
      //   tx,
      //   signMsg,
      // });
      // Must be valid
      if (!pubKey || !signature) {
        throw new Error("Invalid pubKey or signature", pubKey, signature);
      }
      // Post-sign Callback
      postSignCb && postSignCb();
      // Convert pubkey & add signature to tx for the client
      const _pubKey = crypto.getPublicKey(pubKey);
      console.log("ending signer callback");
      return tx.addSignature(_pubKey, Buffer.from(signature, "hex"));
    } catch (err) {
      // Error Callback
      errCb && errCb(err);
      throw new Error(err.error);
    }
  };
