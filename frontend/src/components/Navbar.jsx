import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Menu, X, User, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NotificationBell } from './NotificationBell';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';

export const Navbar = () => {
  const { t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1EC6C6] to-[#0E1A2C] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0E1A2C]">Click<span className="text-[#1EC6C6]">Mecanico</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-[#1EC6C6] transition-colors font-medium">
              {t('nav.home')}
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-[#1EC6C6] transition-colors font-medium">
              {t('nav.howItWorks')}
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-[#1EC6C6] transition-colors font-medium">
              {t('nav.services')}
            </Link>
            <Link to="/become-mechanic" className="text-gray-700 hover:text-[#1EC6C6] transition-colors font-medium">
              {t('nav.becomeMechanic')}
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
            {isAuthenticated && <NotificationBell />}
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user?.name}
                  </Button>
                </Link>
                <Button variant="ghost" onClick={logout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">{t('nav.login')}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <Link
              to="/"
              className="block text-gray-700 hover:text-[#1EC6C6] transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/how-it-works"
              className="block text-gray-700 hover:text-[#1EC6C6] transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.howItWorks')}
            </Link>
            <Link
              to="/services"
              className="block text-gray-700 hover:text-[#1EC6C6] transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.services')}
            </Link>
            <Link
              to="/become-mechanic"
              className="block text-gray-700 hover:text-[#1EC6C6] transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.becomeMechanic')}
            </Link>
            <div className="pt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-[#1EC6C6] hover:bg-[#1AB5B5] text-white">
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-[#1EC6C6] hover:bg-[#1AB5B5] text-white">
                      {t('nav.login')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
