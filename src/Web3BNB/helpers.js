import { chainIds } from "./const";

export const findChainId = (chainIdDescriptor) => {
  const filtered = chainIds.filter(
    (x) =>
      x.name === chainIdDescriptor ||
      (x.id === chainIdDescriptor) | (x.id2 === chainIdDescriptor)
  );
  if (filtered.length === 1) {
    return filtered[0];
  }
  return false;
};

// Filter the Binance Wallet window.BinanceChain.requestAddresses() to an array of relevant addresses
export const filterAddressesBW = (chainIdDescriptor, addressesArray) => {
  const chainId = findChainId(chainIdDescriptor);
  if (!chainId) {
    return [];
  }
  let addresses = [];
  for (let i = 0; i < addressesArray.length; i += 1) {
    if (addressesArray[i].lastIndexOf(chainId.prefix, 0) === 0) {
      addresses.push(addressesArray[i]);
    }
  }
  return addresses;
};

export const getAddressesBW = async () => {
  let addresses = await window.BinanceChain.requestAddresses();
  addresses = filterAddressesBW(window.BinanceChain.chainId, addresses);
  return addresses
};

// Filter the Binance Wallet window.BinanceChain.requestAddresses() to an array of relevant addresses
export const getAccountIdFromAddr = (accountsObj, address) => {
  let index = null;
  if (address.lastIndexOf("tbnb", 0) === 0) {
    index = 0;
  } else if (address.lastIndexOf("bnb", 0) === 0) {
    index = 1;
  } else if (address.lastIndexOf("0x", 0) === 0) {
    index = 2;
  }
  if (index !== null) {
    for (let i = 0; i < accountsObj.length; i += 1) {
      if (address === accountsObj[i].addresses[index].address) {
        return accountsObj[i].id;
      }
    }
  }
  return null;
};

/**
 * Format long string into a string with '...' separator (ideally for anchor text)
 * @param {string} longString
 * @returns {string} shortString
 */
 export const formatShortString = (longString) => {
  const addr = longString || '0x000000000000000'
  const shortString = `${addr.substring(0, 5)}...${addr?.substring(
    addr.length - 3,
    addr.length,
  )}`
  return shortString
}