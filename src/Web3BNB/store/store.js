// continue from: https://redux-toolkit.js.org/tutorials/quick-start

import { Provider, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import bbcReducer from "./bbc";
// import smartReducer from "./smart";

const store = configureStore({
  reducer: {
    bbc: bbcReducer,
    // smart: smartReducer
  },
});

export const useBbc = () => useSelector((state) => state.bbc);
export const useSmart = () => useSelector((state) => state.smart);

export const Web3BNBStore = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
