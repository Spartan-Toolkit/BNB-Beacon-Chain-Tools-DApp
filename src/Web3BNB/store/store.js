// continue from: https://redux-toolkit.js.org/tutorials/quick-start

import { Provider, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import beaconReducer from "./beacon";
// import smartReducer from "./smart";

const store = configureStore({
  reducer: { 
    beacon: beaconReducer,
    // smart: smartReducer 
  },
});

export const useBeacon = () => useSelector((state) => state.beacon)
export const useSmart = () => useSelector((state) => state.smart)

export const Web3BNBProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
