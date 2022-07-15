import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  error: null,
  chainId: undefined,
  accountId: undefined,
  address: undefined,
  walletType: undefined,
  client: undefined,
};

export const beaconSlice = createSlice({
  name: "beacon",
  initialState,
  reducers: {
    updateError: (state, action) => {
      state.error = action.payload;
    },
    updateWalletType: (state, action) => {
      // DO LOCAL STORAGE STUFF
      state.chainId = action.payload.chainId;
      state.walletType = action.payload.walletType;
    },
    updateWalletSelected: (state, action) => {
      // DO LOCAL STORAGE STUFF
      state.accountId = action.payload.accountId;
      state.address = action.payload.address;
      state.client = action.payload.client;
    },
    clearWallet: (state) => {
      // DO LOCAL STORAGE STUFF
      state.chainId = undefined;
      state.accountId = undefined;
      state.address = undefined;
      state.walletType = undefined;
      state.client = undefined;
    },
  },
});

export const { updateError, updateWalletType, updateWalletSelected, clearWallet } = beaconSlice.actions;

export default beaconSlice.reducer;
