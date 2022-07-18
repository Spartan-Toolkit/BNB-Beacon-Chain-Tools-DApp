import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Web3BNBProvider } from "./Web3BNB/providers/Web3BNBProvider";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Web3BNBProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Web3BNBProvider>
  </React.StrictMode>
);
