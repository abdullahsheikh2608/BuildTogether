import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { StartupProvider } from "./context/StartupContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
// One-time migration: remove legacy `bt_user` left in browsers by older app versions
try {
  localStorage.removeItem("bt_user");
} catch {
  // ignore in non-browser environments
}
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StartupProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </StartupProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);