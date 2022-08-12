export const networks = [
  {
    id: "bbc-mainnet", // Preferred identifier used by this library
    idBW: "Binance-Chain-Tigris", // TODO: Confirm BinanceWallet's expected value
    idWC: "https://wallet-bridge.binance.org", // TODO: Confirm WalletConnect's expected value
    idLedger: "", // TODO: Confirm Ledger's expected value/app
    name: "Binance Chain Mainnet", // Label used in front-end
    prefix: "bnb", // Prefix used for the network's wallet addresses
    rpcs: ["https://dex.binance.org/"], // URLs or RPCs for calling and broadcasting
    explorer: "https://explorer.binance.org", // URL for the network's explorer
  },
  {
    id: "bbc-testnet", // Preferred identifier used by this library
    idBW: "Binance-Chain-Ganges", // TODO: Confirm BinanceWallet's expected value
    idWC: "", // TODO: Confirm WalletConnect's expected value *** WC Incompatible with testnet??? ***
    idLedger: "", // TODO: Confirm Ledger's expected value/app
    name: "Binance Chain Testnet", // Label used in front-end
    prefix: "tbnb", // Prefix used for the network's wallet addresses
    rpcs: ["https://testnet-dex.binance.org/"], // URLs or RPCs for calling and broadcasting
    explorer: "https://testnet-explorer.binance.org", // URL for the network's explorer
  },
  {
    id: "bsc-mainnet", // Preferred identifier used by this library
    idBW: "0x38", // TODO: Confirm BinanceWallet's expected value
    idWC: "", // TODO: Confirm WalletConnect's expected value
    idLedger: "56", // TODO: Confirm Ledger's expected value/app
    name: "Binance Smart Chain Mainnet", // Label used in front-end
    prefix: "0x", // Prefix used for the network's wallet addresses
    rpcs: [""], // URLs or RPCs for calling and broadcasting
    explorer: "", // URL for the network's explorer
  },
  {
    id: "bsc-testnet", // Preferred identifier used by this library
    idBW: "0x61", // TODO: Confirm BinanceWallet's expected value
    idWC: "", // TODO: Confirm WalletConnect's expected value *** WC Incompatible with testnet??? ***
    idLedger: "97", // TODO: Confirm Ledger's expected value/app
    name: "Binance Smart Chain Testnet", // Label used in front-end
    prefix: "0x", // Prefix used for the network's wallet addresses
    rpcs: [""], // URLs or RPCs for calling and broadcasting
    explorer: "", // URL for the network's explorer
  },
];

export const getNetwork = (networkId) => {
  const matchingNetworks = networks.filter(
    (x) => [x.id, x.idBW].includes(networkId) // TODO: THINK ABOUT WHAT **UNIQUE** DESCRIPTORS TO INCLUDE HERE (BE CAREFUL WITH LEDGER && WALLETCONNECT)
  );
  if (matchingNetworks.length !== 1) {
    console.log("Invalid network selection");
    return false;
  }
  return matchingNetworks[0];
};

export const getChainIdLS = () => {
  const lsVal = window.localStorage.getItem("sptk_chainId");
  console.log("ChainId lsValue = ", lsVal);
  if (lsVal) {
    window.localStorage.setItem("sptk_chainId", lsVal);
    return lsVal;
  }
  window.localStorage.setItem("sptk_chainId", networks[0].id);
  return networks[0].id;
};

export const getWalletTypeLS = () => {
  const lsVal = window.localStorage.getItem("sptk_walletType");
  console.log("WalletType lsValue = ", lsVal);
  if (lsVal) {
    window.localStorage.setItem("sptk_walletType", lsVal);
    return lsVal;
  }
  return undefined;
};