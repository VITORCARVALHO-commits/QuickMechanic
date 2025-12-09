import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Shield, Clock, Award, MapPin, CheckCircle, Star, TrendingUp, Users } from 'lucide-react';
import { carMakes, serviceTypes } from '../utils/mockData';

export const Home = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [quoteForm, setQuoteForm] = useState({
    make: '',
    model: '',
    year: '',
    service: '',
    location: '',
    description: ''
  });
  const [selectedMake, setSelectedMake] = useState(null);

  const handleMakeChange = (makeId) => {
    const make = carMakes.find(m => m.id === makeId);
    setSelectedMake(make);
    setQuoteForm({ ...quoteForm, make: makeId, model: '' });
  };

  const handleGetQuote = (e) => {
    e.preventDefault();
    // Navigate to search/booking page with quote data
    navigate('/search', { state: { quoteData: quoteForm } });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1EC6C6]/10 via-transparent to-[#FF9F1C]/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block">
                <span className="bg-[#1EC6C6]/10 text-[#1EC6C6] px-4 py-2 rounded-full text-sm font-semibold">
                  {t('home.stats.mechanics')} ✨
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-[#0E1A2C] leading-tight">
                {t('home.hero.title')}
                <span className="block text-[#1EC6C6] mt-2">{t('home.hero.subtitle')}</span>
              </h1>
              <p className="text-xl text-gray-600">
                {t('home.hero.description')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-[#1EC6C6] hover:bg-[#1AB5B5] text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => document.getElementById('quote-section').scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('home.hero.cta')}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 text-lg border-2 border-[#1EC6C6] text-[#1EC6C6] hover:bg-[#1EC6C6] hover:text-white transition-all duration-300"
                  onClick={() => navigate('/how-it-works')}
                >
                  {t('nav.howItWorks')}
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1EC6C6]">500+</div>
                  <div className="text-sm text-gray-600">{t('home.stats.mechanics')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1EC6C6]">15k+</div>
                  <div className="text-sm text-gray-600">{t('home.stats.services')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1EC6C6]">4.8</div>
                  <div className="text-sm text-gray-600">{t('home.stats.rating')}</div>
                </div>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800" 
                  alt="Mechanic working" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2C]/50 to-transparent"></div>
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#27AE60]/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-[#27AE60]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#0E1A2C]">12 meses</div>
                    <div className="text-sm text-gray-600">de garantia</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section id="quote-section" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0E1A2C] mb-4">{t('home.quote.title')}</h2>
            <p className="text-xl text-gray-600">Em menos de 2 minutos</p>
          </div>

          <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-white to-[#F5F7FA]">
            <form onSubmit={handleGetQuote} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Car Make */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0E1A2C]">{t('home.quote.carMake')}</label>
                  <Select value={quoteForm.make} onValueChange={handleMakeChange}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('home.quote.selectMake')} />
                    </SelectTrigger>
                    <SelectContent>
                      {carMakes.map(make => (
                        <SelectItem key={make.id} value={make.id}>{make.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Car Model */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0E1A2C]">{t('home.quote.carModel')}</label>
                  <Select 
                    value={quoteForm.model} 
                    onValueChange={(value) => setQuoteForm({...quoteForm, model: value})}
                    disabled={!selectedMake}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('home.quote.selectModel')} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedMake?.models.map(model => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0E1A2C]">{t('home.quote.carYear')}</label>
                  <Select value={quoteForm.year} onValueChange={(value) => setQuoteForm({...quoteForm, year: value})}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('home.quote.selectYear')} />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Service Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0E1A2C]">{t('home.quote.serviceType')}</label>
                  <Select value={quoteForm.service} onValueChange={(value) => setQuoteForm({...quoteForm, service: value})}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('home.quote.selectService')} />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name[language]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0E1A2C]">{t('home.quote.location')}</label>
                <Input 
                  placeholder="Ex: São Paulo, SP" 
                  value={quoteForm.location}
                  onChange={(e) => setQuoteForm({...quoteForm, location: e.target.value})}
                  className="h-12"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0E1A2C]">{t('home.quote.description')}</label>
                <Textarea 
                  placeholder="Descreva o problema ou serviço necessário..."
                  value={quoteForm.description}
                  onChange={(e) => setQuoteForm({...quoteForm, description: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 bg-gradient-to-r from-[#1EC6C6] to-[#1AB5B5] hover:from-[#1AB5B5] hover:to-[#1EC6C6] text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t('home.quote.calculate')}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0E1A2C] mb-4">{t('home.features.title')}</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow duration-300 border-0 bg-white group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1EC6C6] to-[#1AB5B5] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0E1A2C] mb-2">{t('home.features.feature1.title')}</h3>
              <p className="text-gray-600">{t('home.features.feature1.desc')}</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow duration-300 border-0 bg-white group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF9F1C] to-[#FF8C00] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0E1A2C] mb-2">{t('home.features.feature2.title')}</h3>
              <p className="text-gray-600">{t('home.features.feature2.desc')}</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow duration-300 border-0 bg-white group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#27AE60] to-[#229954] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0E1A2C] mb-2">{t('home.features.feature3.title')}</h3>
              <p className="text-gray-600">{t('home.features.feature3.desc')}</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow duration-300 border-0 bg-white group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2D9CDB] to-[#1976D2] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0E1A2C] mb-2">{t('home.features.feature4.title')}</h3>
              <p className="text-gray-600">{t('home.features.feature4.desc')}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0E1A2C] mb-4">{t('home.howItWorks.title')}</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-[#1EC6C6] via-[#FF9F1C] to-[#27AE60]"></div>
            
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="relative">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#1EC6C6] to-[#1AB5B5] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                    <span className="text-5xl font-bold text-white">{step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0E1A2C] mb-3">
                    {t(`home.howItWorks.step${step}.title`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`home.howItWorks.step${step}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1EC6C6] to-[#1AB5B5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Obtenha seu orçamento gratuito em menos de 2 minutos
          </p>
          <Button 
            size="lg" 
            className="bg-white text-[#1EC6C6] hover:bg-gray-100 px-12 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            onClick={() => document.getElementById('quote-section').scrollIntoView({ behavior: 'smooth' })}
          >
            {t('home.hero.cta')}
          </Button>
        </div>
      </section>
    </div>
  );
};
