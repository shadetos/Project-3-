import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

// StrictMode helps detect potential issues in development.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
