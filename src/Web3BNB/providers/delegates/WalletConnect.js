import { crypto } from "@binance-chain/javascript-sdk";

export const getSigningDelegateWC =
  (preSignCb, postSignCb, errCb, wcClient) => async (tx, signMsg) => {
    try {
      console.log("beginning signer callback", tx, signMsg);
      const _signMsg = JSON.parse(tx.getSignBytes(signMsg).toString());
      _signMsg.from = _signMsg.msgs[0].inputs[0].address;
      console.log(_signMsg);

      // Pre-sign Callback
      preSignCb && preSignCb(tx); // TODO: Trigger modal to confirm pending txn?

      // Sign Txn
      const signObj = await wcClient.sendCustomRequest({
        id: 1,
        jsonrpc: '2.0',
        method: 'bnb_sign',
        params: [_signMsg],
      });

      // Log result (TODO: REMOVE WHEN TESTED)
      console.log(signObj);

      const { signature, publicKey } = JSON.parse(signObj)
      const bufferSig = Buffer.from(signature, 'hex')
      const pubKey = crypto.getPublicKey(publicKey)

      // Post-sign Callback
      postSignCb && postSignCb(tx); // TODO: Close modal once completed?
      console.log("ending signer callback");

      return tx.addSignature(pubKey, bufferSig)
    } catch (err) {
      // Error Callback
      errCb && errCb(err); // TODO: Show error info in modal on error?
      throw new Error(err.error);
    }
  };
