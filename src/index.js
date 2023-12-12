import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AppRoutes from './routes';

// Import styles
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

// Import layouts
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";

// Import AuthContext
import { AuthContext } from "context/AuthContext";
import { AuthContextProvider } from "context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

const RequireAuth = ({ children }) => {
  const { currentUser } = useContext(AuthContext); // Using useContext to access currentUser
  return currentUser ? children : <Navigate to="/auth/login" />;
};

root.render(
  <AuthContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<RequireAuth>
          <AdminLayout />
        </RequireAuth>} />
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthContextProvider>
);
