import { crypto } from "@binance-chain/javascript-sdk";

export const getSigningDelegateBW =
  (preSignCb, postSignCb, errCb) => async (tx, signMsg) => {
    try {
      console.log("beginning signer callback", tx, signMsg);
      // Pre-sign Callback
      preSignCb && preSignCb();

      // Sign Txn BACKUP SIGN METHOD (Buggy UI for MultiSend)
      // const { pubKey, signature } = await window.BinanceChain?.bbcSignTx({
      //   tx,
      //   signMsg,
      // });

      // Sign Txn RAW SIGN METHOD
      const signBytes = tx.getSignBytes(signMsg);
      const { publicKey: pubKey, signature } =
        await window.BinanceChain?.bnbSign(
          signMsg.inputs[0].address,
          signBytes.toString()
        );

      // Log result (TODO: REMOVE WHEN TESTED)
      console.log(pubKey, signature);

      // Must be valid
      if (!pubKey || !signature) {
        throw new Error("Invalid pubKey or signature", pubKey, signature);
      }

      // Post-sign Callback
      postSignCb && postSignCb();

      // Convert pubkey & add signature to tx for the client
      // const _pubKey = crypto.getPublicKey(pubKey); // BACKUP SIGN METHOD (Buggy UI for MultiSend)
      const _pubKey = crypto.getPublicKey(pubKey.slice(2)); // RAW SIGN METHOD
      console.log("ending signer callback");

      console.log("target type", Buffer.from(signature.slice(2), "hex"));
      // return tx.addSignature(_pubKey, Buffer.from(signature, "hex")); // BACKUP SIGN METHOD (Buggy UI for MultiSend)
      return tx.addSignature(_pubKey, Buffer.from(signature.slice(2), "hex")); // RAW SIGN METHOD
    } catch (err) {
      // Error Callback
      errCb && errCb(err);
      throw new Error(err.error);
    }
  };
