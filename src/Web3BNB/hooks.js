// const BASENUMBER = Math.pow(10, 8)

// export const api = {
//   broadcast: "/api/v1/broadcast",
//   nodeInfo: "/api/v1/node-info",
//   getAccount: "/api/v1/account",
//   getMarkets: "/api/v1/markets",
//   getSwaps: "/api/v1/atomic-swaps",
//   getOpenOrders: "/api/v1/orders/open",
//   getDepth: "/api/v1/depth",
//   getTransactions: "/api/v1/transactions",
//   getTxs: "/bc/api/v1/txs",
//   getTx: "/api/v1/tx",
// }

// export const NETWORK_PREFIX_MAPPING = {
//   testnet: "tbnb",
//   mainnet: "bnb",
// }

//   /**
//    * Initialize the client with the chain's ID. Asynchronous.
//    */
//   export const initChain = async(BncClient) => {
//     BncClient.initChain()
//   }

//   /**
//    * Sets the client network (testnet or mainnet).
//    * @param {String} network Indicate 'testnet' or 'mainnet'
//    */
//    export const chooseNetwork = (BncClient, network) => {
//     BncClient.chooseNetwork(network)
//   }

//   /**
//    * Sets the signing delegate (for Binance Wallet chrome ext integration).
//    * @param {function} delegate
//    * @return {BncClient} this instance (for chaining)
//    */
//    export const setSigningDelegate = (BncClient, delegate) => {
//     BncClient.setSigningDelegate(delegate)
//     // update context with returned BncClient?
//   }

//   /**
//    * Applies the default signing delegate.
//    * @return {BncClient} this instance (for chaining)
//    */
//    export const useDefaultSigningDelegate = (BncClient) => {
//     BncClient.useDefaultSigningDelegate()
//     // update context with returned BncClient?
//   }

//   /**
//    * Applies the default broadcast delegate.
//    * @return {BncClient} this instance (for chaining)
//    */
//    export const useDefaultBroadcastDelegate = (BncClient) => {
//     BncClient.useDefaultBroadcastDelegate()
//     // update context with returned BncClient?
//   }

//   /**
//    * Applies the Ledger signing delegate.
//    * @param {function} ledgerApp
//    * @param {function} preSignCb pending message
//    * @param {function} postSignCb completed message
//    * @param {function} errCb error message
//    * @param {number[]} hdPath (optional select which index/hdpath/account)
//    * @return {BncClient} this instance (for chaining)
//    */
//   const useLedgerSigningDelegate = (BncClient, ledgerApp, preSignCb, postSignCb, errCb, hdPath = null) => {
//     BncClient.useLedgerSigningDelegate(ledgerApp, preSignCb, postSignCb, errCb, hdPath)
//     // update context with returned BncClient?
//   }

//   /**
//    * Transfer tokens from one address to another.
//    * @param {String} fromAddress
//    * @param {String} toAddress
//    * @param {Number} amount
//    * @param {String} asset
//    * @param {String} memo optional memo
//    * @param {Number} sequence optional sequence
//    * @return {Promise} resolves with response (success or fail)
//    */
//   const transfer = async(
//     BncClient,
//     fromAddress,
//     toAddress,
//     amount,
//     asset,
//     memo = "",
//     sequence
//   ) =>{
//     const result = await BncClient.transfer(fromAddress, toAddress, amount, asset, memo, sequence)
//     return result
//   }

//   /**
//    * Create and sign a multi send tx
//    * @param {String} fromAddress
//    * @param {Array} outputs
//    * @example
//    * const outputs = [
//    * {
//    *   "to": "tbnb1p4kpnj5qz5spsaf0d2555h6ctngse0me5q57qe",
//    *   "coins": [{
//    *     "denom": "BNB",
//    *     "amount": 10
//    *   },{
//    *     "denom": "BTC",
//    *     "amount": 10
//    *   }]
//    * },
//    * {
//    *   "to": "tbnb1scjj8chhhp7lngdeflltzex22yaf9ep59ls4gk",
//    *   "coins": [{
//    *     "denom": "BTC",
//    *     "amount": 10
//    *   },{
//    *     "denom": "BNB",
//    *     "amount": 10
//    *   }]
//    * }]
//    * @param {String} memo optional memo
//    * @param {Number} sequence optional sequence
//    * @return {Promise} resolves with response (success or fail)
//    */
//   const multiSend = async (
//     BncClient,
//     fromAddress,
//     outputs,
//     memo = "",
//     sequence
//   ) => {
//     const result = await BncClient.multiSend(fromAddress, outputs, memo, sequence)
//     return result
//   }

//   /**
//    * Cancel an order.
//    * @param {String} fromAddress
//    * @param {String} symbol the market pair
//    * @param {String} refid the order ID of the order to cancel
//    * @param {Number} sequence optional sequence
//    * @return {Promise} resolves with response (success or fail)
//    */
//   const cancelOrder = async(
//     BncClient,
//     fromAddress,
//     symbol,
//     refid,
//     sequence
//   ) => {
//     const result = await BncClient.cancelOrder(fromAddress, symbol, refid, sequence)
//     return result
//   }

//   /**
//    * Place an order.
//    * @param {String} address
//    * @param {String} symbol the market pair
//    * @param {Number} side (1-Buy, 2-Sell)
//    * @param {Number} price
//    * @param {Number} quantity
//    * @param {Number} sequence optional sequence
//    * @param {Number} timeinforce (1-GTC(Good Till Expire), 3-IOC(Immediate or Cancel))
//    * @return {Promise} resolves with response (success or fail)
//    */
//   async placeOrder(
//     address,
//     symbol,
//     side,
//     price,
//     quantity,
//     sequence,
//     timeinforce = 1
//   ) {
//     if (!address) {
//       throw new Error("address should not be falsy")
//     }
//     if (!symbol) {
//       throw new Error("symbol should not be falsy")
//     }
//     if (side !== 1 && side !== 2) {
//       throw new Error("side can only be 1 or 2")
//     }
//     if (timeinforce !== 1 && timeinforce !== 3) {
//       throw new Error("timeinforce can only be 1 or 3")
//     }

//     const accCode = crypto.decodeAddress(address)

//     if (sequence !== 0 && !sequence) {
//       const data = await this._httpClient.request(
//         "get",
//         `${api.getAccount}/${address}`
//       )
//       sequence = data.result && data.result.sequence
//     }

//     const bigPrice = new Big(price)
//     const bigQuantity = new Big(quantity)

//     const placeOrderMsg = {
//       sender: accCode,
//       id: `${accCode.toString("hex")}-${sequence! + 1}`.toUpperCase(),
//       symbol: symbol,
//       ordertype: 2,
//       side,
//       price: parseFloat(bigPrice.mul(BASENUMBER).toString()),
//       quantity: parseFloat(bigQuantity.mul(BASENUMBER).toString()),
//       timeinforce: timeinforce,
//       aminoPrefix: AminoPrefix.NewOrderMsg,
//     }

//     const signMsg = {
//       id: placeOrderMsg.id,
//       ordertype: placeOrderMsg.ordertype,
//       price: placeOrderMsg.price,
//       quantity: placeOrderMsg.quantity,
//       sender: address,
//       side: placeOrderMsg.side,
//       symbol: placeOrderMsg.symbol,
//       timeinforce: timeinforce,
//     }

//     checkNumber(placeOrderMsg.price, "price")
//     checkNumber(placeOrderMsg.quantity, "quantity")

//     const signedTx = await this._prepareTransaction(
//       placeOrderMsg,
//       signMsg,
//       address,
//       sequence,
//       ""
//     )

//     return this._broadcastDelegate(signedTx)
//   }

//   /**
//    * @param {String} address
//    * @param {Number} proposalId
//    * @param {String} baseAsset
//    * @param {String} quoteAsset
//    * @param {Number} initPrice
//    * @param {Number} sequence optional sequence
//    * @return {Promise} resolves with response (success or fail)
//    */
//   async list(
//     address: string,
//     proposalId: number,
//     baseAsset: string,
//     quoteAsset: string,
//     initPrice: number,
//     sequence: number | null = null
//   ) {
//     const accCode = crypto.decodeAddress(address)

//     if (!address) {
//       throw new Error("address should not be falsy")
//     }

//     if (proposalId <= 0) {
//       throw new Error("proposal id should larger than 0")
//     }

//     if (initPrice <= 0) {
//       throw new Error("price should larger than 0")
//     }

//     if (!baseAsset) {
//       throw new Error("baseAsset should not be falsy")
//     }

//     if (!quoteAsset) {
//       throw new Error("quoteAsset should not be falsy")
//     }

//     const init_price = Number(new Big(initPrice).mul(BASENUMBER).toString())

//     const listMsg = {
//       from: accCode,
//       proposal_id: proposalId,
//       base_asset_symbol: baseAsset,
//       quote_asset_symbol: quoteAsset,
//       init_price: init_price,
//       aminoPrefix: AminoPrefix.ListMsg,
//     }

//     const signMsg = {
//       base_asset_symbol: baseAsset,
//       from: address,
//       init_price: init_price,
//       proposal_id: proposalId,
//       quote_asset_symbol: quoteAsset,
//     }

//     const signedTx = await this._prepareTransaction(
//       listMsg,
//       signMsg,
//       address,
//       sequence,
//       ""
//     )
//     return this._broadcastDelegate(signedTx)
//   }

//   /**
//    * list miniToken
//    */
//   async listMiniToken({
//     from,
//     baseAsset,
//     quoteAsset,
//     initPrice,
//     sequence = null,
//   }: {
//     from: string
//     baseAsset: string
//     quoteAsset: string
//     initPrice: number
//     sequence?: number | null
//   }) {
//     validateMiniTokenSymbol(baseAsset)

//     if (initPrice <= 0) {
//       throw new Error("price should larger than 0")
//     }

//     if (!from) {
//       throw new Error("address should not be falsy")
//     }

//     if (!quoteAsset) {
//       throw new Error("quoteAsset should not be falsy")
//     }

//     const init_price = Number(new Big(initPrice).mul(BASENUMBER).toString())

//     const listMiniMsg = new ListMiniMsg({
//       from,
//       base_asset_symbol: baseAsset,
//       quote_asset_symbol: quoteAsset,
//       init_price,
//     })

//     const signedTx = await this._prepareTransaction(
//       listMiniMsg.getMsg(),
//       listMiniMsg.getSignMsg(),
//       from,
//       sequence
//     )
//     return this._broadcastDelegate(signedTx)
//   }

//   /**
//    * Set account flags
//    * @param {String} address
//    * @param {Number} flags new value of account flags
//    * @param {Number} sequence optional sequence
//    * @return {Promise} resolves with response (success or fail)
//    */
//   async setAccountFlags(
//     address: string,
//     flags: number,
//     sequence: number | null = null
//   ) {
//     const accCode = crypto.decodeAddress(address)

//     const msg = {
//       from: accCode,
//       flags: flags,
//       aminoPrefix: AminoPrefix.SetAccountFlagsMsg,
//     }

//     const signMsg = {
//       flags: flags,
//       from: address,
//     }

//     const signedTx = await this._prepareTransaction(
//       msg,
//       signMsg,
//       address,
//       sequence,
//       ""
//     )
//     return this._broadcastDelegate(signedTx)
//   }

//   /**
//    * Prepare a serialized raw transaction for sending to the blockchain.
//    * @param {Object} msg the msg object
//    * @param {Object} stdSignMsg the sign doc object used to generate a signature
//    * @param {String} address
//    * @param {Number} sequence optional sequence
//    * @param {String} memo optional memo
//    * @return {Transaction} signed transaction
//    */
//   async _prepareTransaction(
//     msg: any,
//     stdSignMsg: any,
//     address: string,
//     sequence: string | number | null = null,
//     memo = ""
//   ) {
//     if ((!this.account_number || (sequence !== 0 && !sequence)) && address) {
//       const data = await this._httpClient.request(
//         "get",
//         `${api.getAccount}/${address}`
//       )
//       sequence = data.result.sequence
//       this.account_number = data.result.account_number
//       // if user has not used `await` in its call to setPrivateKey (old API), we should wait for the promise here
//     } else if (this._setPkPromise) {
//       await this._setPkPromise
//     }

//     const tx = new Transaction({
//       accountNumber:
//         typeof this.account_number !== "number"
//           ? parseInt(this.account_number!)
//           : this.account_number,
//       chainId: this.chainId!,
//       memo: memo,
//       msg,
//       sequence: typeof sequence !== "number" ? parseInt(sequence!) : sequence,
//       source: this._source,
//     })

//     return this._signingDelegate.call(this, tx, stdSignMsg)
//   }

//   /**
//    * Broadcast a transaction to the blockchain.
//    * @param {signedTx} tx signed Transaction object
//    * @param {Boolean} sync use synchronous mode, optional
//    * @return {Promise} resolves with response (success or fail)
//    */
//   async sendTransaction(signedTx: Transaction, sync: boolean) {
//     const signedBz = signedTx.serialize()
//     return this.sendRawTransaction(signedBz, sync)
//   }

//   /**
//    * Broadcast a raw transaction to the blockchain.
//    * @param {String} signedBz signed and serialized raw transaction
//    * @param {Boolean} sync use synchronous mode, optional
//    * @return {Promise} resolves with response (success or fail)
//    */
//   async sendRawTransaction(signedBz: string, sync = !this._useAsyncBroadcast) {
//     const opts = {
//       data: signedBz,
//       headers: {
//         "content-type": "text/plain",
//       },
//     }
//     return this._httpClient.request(
//       "post",
//       `${api.broadcast}?sync=${sync}`,
//       null,
//       opts
//     )
//   }

//   /**
//    * Broadcast a raw transaction to the blockchain.
//    * @param {Object} msg the msg object
//    * @param {Object} stdSignMsg the sign doc object used to generate a signature
//    * @param {String} address
//    * @param {Number} sequence optional sequence
//    * @param {String} memo optional memo
//    * @param {Boolean} sync use synchronous mode, optional
//    * @return {Promise} resolves with response (success or fail)
//    */
//   async _sendTransaction(
//     msg: any,
//     stdSignMsg: any,
//     address: string,
//     sequence: string | number | null = null,
//     memo = "",
//     sync = !this._useAsyncBroadcast
//   ) {
//     const signedTx = await this._prepareTransaction(
//       msg,
//       stdSignMsg,
//       address,
//       sequence,
//       memo
//     )
//     return this.sendTransaction(signedTx, sync)
//   }

//   /**
//    * get account
//    * @param {String} address
//    * @return {Promise} resolves with http response
//    */
//   async getAccount(address = this.address) {
//     if (!address) {
//       throw new Error("address should not be falsy")
//     }
//     try {
//       const data = await this._httpClient.request(
//         "get",
//         `${api.getAccount}/${address}`
//       )
//       return data
//     } catch (err) {
//       return null
//     }
//   }

//   /**
//    * get balances
//    * @param {String} address optional address
//    * @return {Promise} resolves with http response
//    */
//   async getBalance(address = this.address) {
//     try {
//       const data = await this.getAccount(address)
//       return data!.result.balances
//     } catch (err) {
//       return []
//     }
//   }

//   /**
//    * get markets
//    * @param {Number} limit max 1000 is default
//    * @param {Number} offset from beggining, default 0
//    * @return {Promise} resolves with http response
//    */
//   async getMarkets(limit = 1000, offset = 0) {
//     try {
//       const data = await this._httpClient.request(
//         "get",
//         `${api.getMarkets}?limit=${limit}&offset=${offset}`
//       )
//       return data
//     } catch (err) {
//       console.warn("getMarkets error", err)
//       return []
//     }
//   }

//   /**
//    * get transactions for an account
//    * @param {String} address optional address
//    * @param {Number} offset from beggining, default 0
//    * @return {Promise} resolves with http response
//    * @deprecated please use getTxs instead.
//    */
//   async getTransactions(address = this.address, offset = 0) {
//     try {
//       const data = await this._httpClient.request(
//         "get",
//         `${api.getTransactions}?address=${address}&offset=${offset}`
//       )
//       return data
//     } catch (err) {
//       console.warn("getTransactions error", err)
//       return []
//     }
//   }

//   /**
//    * get transactions for an account
//    * @param {String} address optional address
//    * @param {Number} startTime start time in milliseconds
//    * @param {Number} endTime end time in in milliseconds, endTime - startTime should be smaller than 7 days
//    * @return {Promise} resolves with http response ([more details](https://docs.binance.org/api-reference/dex-api/block-service.html#apiv1txs))
//    * ```js
//    * // Example:
//    * const client = new BncClient('https://testnet-api.binance.org')
//    * client.getTxs(...);
//    * ```
//    */
//   async getTxs(address = this.address, startTime: number, endTime: number) {
//     try {
//       const data = await this._httpClient.request(
//         "get",
//         `${api.getTxs}?address=${address}&startTime=${startTime}&endTime=${endTime}`
//       )
//       return data
//     } catch (err) {
//       console.warn("getTxs error", err)
//       return []
//     }
//   }

//   /**
//    * get transaction
//    * @param {String} hash the transaction hash
//    * @return {Promise} resolves with http response
//    */
//   async getTx(hash: string) {
//     try {
//       const data = await this._httpClient.request("get", `${api.getTx}/${hash}`)
//       return data
//     } catch (err) {
//       console.warn("getTx error", err)
//       return []
//     }
//   }

//   /**
//    * get depth for a given market
//    * @param {String} symbol the market pair
//    * @return {Promise} resolves with http response
//    */
//   async getDepth(symbol = "BNB_BUSD-BD1") {
//     try {
//       const data = await this._httpClient.request(
//         "get",
//         `${api.getDepth}?symbol=${symbol}`
//       )
//       return data
//     } catch (err) {
//       console.warn("getDepth error", err)
//       return []
//     }
//   }

//   /**
//    * get open orders for an address
//    * @param {String} address binance address
//    * @param {String} symbol binance BEP2 symbol
//    * @return {Promise} resolves with http response
//    */
//   async getOpenOrders(address: string = this.address!) {
//     try {
//       const data = await this._httpClient.request(
//         "get",
//         `${api.getOpenOrders}?address=${address}`
//       )
//       return data
//     } catch (err) {
//       console.warn("getOpenOrders error", err)
//       return []
//     }
//   }

//   /**
//    * get atomic swap
//    * @param {String} swapID: ID of an existing swap
//    * @return {Promise} AtomicSwap
//    */
//   async getSwapByID(swapID: string) {
//     try {
//       const data = await this._httpClient.request(
//         "get",
//         `${api.getSwaps}/${swapID}`
//       )
//       return data
//     } catch (err) {
//       console.warn("query swap by swapID error", err)
//       return []
//     }
//   }

//   /**
//    * query atomic swap list by creator address
//    * @param {String} creator: swap creator address
//    * @param {Number} offset from beginning, default 0
//    * @param {Number} limit, max 1000 is default
//    * @return {Promise} Array of AtomicSwap
//    */
//   async getSwapByCreator(creator: string, limit = 100, offset = 0) {
//     try {
//       const data = await this._httpClient.request(
//         "get",
//         `${api.getSwaps}?fromAddress=${creator}&limit=${limit}&offset=${offset}`
//       )
//       return data
//     } catch (err) {
//       console.warn("query swap list by swap creator error", err)
//       return []
//     }
//   }

//   /**
//    * query atomic swap list by recipient address
//    * @param {String} recipient: the recipient address of the swap
//    * @param {Number} offset from beginning, default 0
//    * @param {Number} limit, max 1000 is default
//    * @return {Promise} Array of AtomicSwap
//    */
//   async getSwapByRecipient(recipient: string, limit = 100, offset = 0) {
//     try {
//       const data = await this._httpClient.request(
//         "get",
//         `${api.getSwaps}?toAddress=${recipient}&limit=${limit}&offset=${offset}`
//       )
//       return data
//     } catch (err) {
//       console.warn("query swap list by swap recipient error", err)
//       return []
//     }
//   }

//   /**
//    * Creates a private key and returns it and its address.
//    * @return {object} the private key and address in an object.
//    * {
//    *  address,
//    *  privateKey
//    * }
//    */
//   createAccount() {
//     const privateKey = crypto.generatePrivateKey()
//     return {
//       privateKey,
//       address: crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix),
//     }
//   }

//   /**
//    * Creates an account keystore object, and returns the private key and address.
//    * @param {String} password
//    *  {
//    *  privateKey,
//    *  address,
//    *  keystore
//    * }
//    */
//   createAccountWithKeystore(password: string) {
//     if (!password) {
//       throw new Error("password should not be falsy")
//     }
//     const privateKey = crypto.generatePrivateKey()
//     const address = crypto.getAddressFromPrivateKey(
//       privateKey,
//       this.addressPrefix
//     )
//     const keystore = crypto.generateKeyStore(privateKey, password)
//     return {
//       privateKey,
//       address,
//       keystore,
//     }
//   }

//   /**
//    * Creates an account from mnemonic seed phrase.
//    * @return {object}
//    * {
//    *  privateKey,
//    *  address,
//    *  mnemonic
//    * }
//    */
//   createAccountWithMneomnic() {
//     const mnemonic = crypto.generateMnemonic()
//     const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)
//     const address = crypto.getAddressFromPrivateKey(
//       privateKey,
//       this.addressPrefix
//     )
//     return {
//       privateKey,
//       address,
//       mnemonic,
//     }
//   }

//   /**
//    * Recovers an account from a keystore object.
//    * @param {object} keystore object.
//    * @param {string} password password.
//    * {
//    * privateKey,
//    * address
//    * }
//    */
//   recoverAccountFromKeystore(
//     keystore: Parameters<typeof crypto.getPrivateKeyFromKeyStore>[0],
//     password: Parameters<typeof crypto.getPrivateKeyFromKeyStore>[1]
//   ) {
//     const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password)
//     const address = crypto.getAddressFromPrivateKey(
//       privateKey,
//       this.addressPrefix
//     )
//     return {
//       privateKey,
//       address,
//     }
//   }

//   /**
//    * Recovers an account from a mnemonic seed phrase.
//    * @param {string} mneomnic
//    * {
//    * privateKey,
//    * address
//    * }
//    */
//   recoverAccountFromMnemonic(mnemonic: string) {
//     const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)
//     const address = crypto.getAddressFromPrivateKey(
//       privateKey,
//       this.addressPrefix
//     )
//     return {
//       privateKey,
//       address,
//     }
//   }
//   // support an old method name containing a typo
//   recoverAccountFromMneomnic(mnemonic: string) {
//     return this.recoverAccountFromMnemonic(mnemonic)
//   }

//   /**
//    * Recovers an account using private key.
//    * @param {String} privateKey
//    * {
//    * privateKey,
//    * address
//    * }
//    */
//   recoverAccountFromPrivateKey(privateKey: string) {
//     const address = crypto.getAddressFromPrivateKey(
//       privateKey,
//       this.addressPrefix
//     )
//     return {
//       privateKey,
//       address,
//     }
//   }

//   /**
//    * Validates an address.
//    * @param {String} address
//    * @param {String} prefix
//    * @return {Boolean}
//    */
//   checkAddress(
//     address: string,
//     prefix: BncClient["addressPrefix"] = this.addressPrefix
//   ) {
//     return crypto.checkAddress(address, prefix)
//   }

//   /**
//    * Returns the address for the current account if setPrivateKey has been called on this client.
//    * @return {String}
//    */
//   getClientKeyAddress() {
//     if (!this._privateKey)
//       throw new Error("no private key is set on this client")
//     const address = crypto.getAddressFromPrivateKey(
//       this._privateKey,
//       this.addressPrefix
//     )
//     this.address = address
//     return address
//   }