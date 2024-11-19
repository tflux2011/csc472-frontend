import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';
import { AuthProvider } from "./contexts/AuthContext";
import { PolicyProvider } from "./contexts/PolicyContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <PolicyProvider>
        <App />
      </PolicyProvider>
    </AuthProvider>
  </React.StrictMode>
);