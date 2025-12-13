import React from "react";
import "./App.css";
import "./styles/improvements.css";
import "./styles/dark-mode.css";
import { ThemeProvider } from "./contexts/ThemeContext";
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
import { AdminDashboard } from "./pages/AdminDashboardNew";
import { AdminMechanicsApproval } from "./pages/AdminMechanicsApproval";
import { MechanicAgenda } from "./pages/MechanicAgenda";
import { MechanicEarnings } from "./pages/MechanicEarnings";
import { GoogleCallback } from "./pages/GoogleCallback";
import { AdminDisputes } from "./pages/AdminDisputes";
import { HowItWorks } from "./pages/HowItWorks";
import { Services } from "./pages/Services";
import { BecomeMechanic } from "./pages/BecomeMechanic";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { Precos } from "./pages/Precos";
import { Contato } from "./pages/Contato";
import { FAQ } from "./pages/FAQ";
import { Termos } from "./pages/Termos";
import { Privacidade } from "./pages/Privacidade";
import { Cancelamento } from "./pages/Cancelamento";
import { ParceirosOficina } from "./pages/ParceirosOficina";

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
    <ThemeProvider>
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
                <Route path="/precos" element={<Precos />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/termos" element={<Termos />} />
                <Route path="/privacidade" element={<Privacidade />} />
                <Route path="/cancelamento" element={<Cancelamento />} />
                <Route path="/parceiros/oficina" element={<ParceirosOficina />} />
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
                <Route 
                  path="/mechanic/agenda" 
                  element={
                    <ProtectedRoute>
                      <MechanicAgenda />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/mechanic/earnings" 
                  element={
                    <ProtectedRoute>
                      <MechanicEarnings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/auth/google/callback" 
                  element={<GoogleCallback />} 
                />
                <Route 
                  path="/admin/disputes" 
                  element={
                    <ProtectedRoute>
                      <AdminDisputes />
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
    </ThemeProvider>
  );
}

export default App;
