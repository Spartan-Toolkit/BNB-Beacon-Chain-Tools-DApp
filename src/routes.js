import Transfer from "./pages/Transfer";

export const routes = [
  { label: "Home", route: "/", component: <div>Placeholder Home</div> }, // Home
  { label: "Transfer", route: "transfer", component: <Transfer /> }, // Transfer + batch/multi-send
  {
    label: "Freeze",
    route: "freeze",
    component: <div>Placeholder Freeze</div>,
  }, // Freeze / Unfreeze assets
  { label: "Fees", route: "fees", component: <div>Placeholder Fees</div> }, // List all beacon chain fees
];
