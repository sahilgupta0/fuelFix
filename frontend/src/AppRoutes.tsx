import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import RequestService from "./pages/RequestService";
import MyRequests from "./pages/MyRequests";
import Requests from "./pages/Requests";
import Landing from "./pages/Landing";
import useSaveLocation from "./hooks/useSaveLocation";

const AppRoutes = () => {
  const navigate = useNavigate();

  // Save route on change
  useSaveLocation();

  // Restore last route after reload
  useEffect(() => {
    const lastRoute = sessionStorage.getItem("lastRoute");
    if (lastRoute && window.location.pathname === "/logmain") {
      navigate(lastRoute);
    }
  }, [navigate]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/logmain" element={<Index />} />
        <Route path="/requestservice" element={<RequestService />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/myrequests" element={<MyRequests />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
