import React from "react";
import ReactDOM from "react-dom/client";
import CapitalEquipment from "./pages/CapitalEquipment";
import "./theme.css"; // Make sure Tailwind is imported

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CapitalEquipment />
  </React.StrictMode>
);
