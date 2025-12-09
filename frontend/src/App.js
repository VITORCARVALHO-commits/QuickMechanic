import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/toaster";
import { Home } from "./pages/Home";
import { SearchBooking } from "./pages/SearchBooking";
import { BookingPage } from "./pages/BookingPage";
import { MechanicProfile } from "./pages/MechanicProfile";
import { Dashboard } from "./pages/Dashboard";
import { HowItWorks } from "./pages/HowItWorks";
import { Services } from "./pages/Services";
import { BecomeMechanic } from "./pages/BecomeMechanic";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="App min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchBooking />} />
              <Route path="/booking/:mechanicId" element={<BookingPage />} />
              <Route path="/mechanic/:mechanicId" element={<MechanicProfile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/services" element={<Services />} />
              <Route path="/become-mechanic" element={<BecomeMechanic />} />
              <Route path="/login" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
