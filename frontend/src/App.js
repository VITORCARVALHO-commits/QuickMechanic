import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/toaster";
import { Home } from "./pages/Home";
import { SearchBooking } from "./pages/SearchBooking";
import { BookingPage } from "./pages/BookingPage";
import { BookingQuote } from "./pages/BookingQuote";
import { MechanicProfile } from "./pages/MechanicProfile";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ClientDashboard } from "./pages/ClientDashboardNew";
import { MechanicDashboard } from "./pages/MechanicDashboardNew";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminMechanicsApproval } from "./pages/AdminMechanicsApproval";
import { HowItWorks } from "./pages/HowItWorks";
import { Services } from "./pages/Services";
import { BecomeMechanic } from "./pages/BecomeMechanic";
import { PaymentSuccess } from "./pages/PaymentSuccess";

// Protected Route Component
const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-[#1EC6C6]">Loading...</div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Dashboard Router - routes to correct dashboard based on user type
const DashboardRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-[#1EC6C6]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.user_type === 'admin') {
    return <AdminDashboard />;
  }

  if (user.user_type === 'mechanic') {
    return <MechanicDashboard />;
  }

  return <ClientDashboard />;
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="App min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quote" element={<BookingQuote />} />
                <Route path="/search" element={<SearchBooking />} />
                <Route path="/booking/:mechanicId" element={<BookingPage />} />
                <Route path="/mechanic/:mechanicId" element={<MechanicProfile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardRouter />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/services" element={<Services />} />
                <Route path="/become-mechanic" element={<BecomeMechanic />} />
                <Route 
                  path="/payment-success" 
                  element={
                    <ProtectedRoute>
                      <PaymentSuccess />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/mechanics" 
                  element={
                    <ProtectedRoute>
                      <AdminMechanicsApproval />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/mechanic/dashboard" 
                  element={
                    <ProtectedRoute>
                      <MechanicDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
