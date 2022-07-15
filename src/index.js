import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Web3BNBProvider } from "./Web3BNB";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Web3BNBProvider>
      <App />
    </Web3BNBProvider>
  </React.StrictMode>
);
