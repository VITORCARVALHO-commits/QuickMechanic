import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0E1A2C] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1EC6C6] to-[#FF9F1C] flex items-center justify-center">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Click<span className="text-[#1EC6C6]">Mecanico</span></span>
            </div>
            <p className="text-gray-400 text-sm">
              {t('home.hero.description')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[#1EC6C6] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#1EC6C6] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#1EC6C6] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">{t('nav.home')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[#1EC6C6] transition-colors text-sm">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-[#1EC6C6] transition-colors text-sm">
                  {t('nav.howItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-[#1EC6C6] transition-colors text-sm">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link to="/become-mechanic" className="text-gray-400 hover:text-[#1EC6C6] transition-colors text-sm">
                  {t('nav.becomeMechanic')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-white">{t('services.title')}</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">{t('services.oilChange')}</li>
              <li className="text-gray-400 text-sm">{t('services.brakes')}</li>
              <li className="text-gray-400 text-sm">{t('services.suspension')}</li>
              <li className="text-gray-400 text-sm">{t('services.diagnostic')}</li>
              <li className="text-gray-400 text-sm">{t('services.maintenance')}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="h-4 w-4 text-[#1EC6C6]" />
                +55 11 9999-9999
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="h-4 w-4 text-[#1EC6C6]" />
                contato@clickmecanico.com
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 text-[#1EC6C6] mt-1" />
                São Paulo, Brasil
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 ClickMecanico. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
