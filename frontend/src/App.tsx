
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import RequestService from "./pages/RequestService";
import MyRequests from "./pages/MyRequests";
import Requests from "./pages/Requests";
import Landing from "./pages/Landing";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create a client
const queryClient = new QueryClient();

const App = () => {

  const isAuthenticated = localStorage.getItem('token');

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/dashboard'); // or wherever you want
  //   }
  // }, [isAuthenticated, navigate]);
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing/>}/>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/logmain" element={<Index />} />
                <Route path="/requestservice" element={<RequestService />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/myrequests" element={<MyRequests/>} />
                
                {/* Add more protected routes here */}
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
