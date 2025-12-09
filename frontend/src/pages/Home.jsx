import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { toast } from '../hooks/use-toast';
import { Shield, Clock, Award, MapPin, CheckCircle, Star, TrendingUp, Users, Search, Loader2, Car, AlertCircle } from 'lucide-react';
import { carMakes, serviceTypes } from '../utils/mockData';
import { searchPlate, validatePlateFormat } from '../utils/mockPlates';

export const Home = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // Plate search states
  const [plateInput, setPlateInput] = useState('');
  const [isSearchingPlate, setIsSearchingPlate] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);
  
  // Quote form states
  const [quoteForm, setQuoteForm] = useState({
    plate: '',
    make: '',
    model: '',
    year: '',
    color: '',
    fuel: '',
    version: '',
    category: '',
    service: '',
    location: '',
    description: ''
  });
  const [selectedMake, setSelectedMake] = useState(null);

  const handlePlateSearch = async () => {
    if (!plateInput.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, digite a placa do veículo.",
        variant: "destructive"
      });
      return;
    }

    if (!validatePlateFormat(plateInput)) {
      toast({
        title: "Placa Inválida",
        description: "Formato de placa inválido. Use o formato ABC-1234.",
        variant: "destructive"
      });
      return;
    }

    setIsSearchingPlate(true);
    
    try {
      const result = await searchPlate(plateInput);
      setVehicleFound(result.data);
      setQuoteForm({
        ...quoteForm,
        plate: result.data.plate,
        make: result.data.make,
        model: result.data.model,
        year: result.data.year,
        color: result.data.color,
        fuel: result.data.fuel,
        version: result.data.version,
        category: result.data.category
      });
      
      toast({
        title: "✅ Veículo Encontrado!",
        description: `${result.data.makeName} ${result.data.model} ${result.data.year}`
      });
    } catch (error) {
      toast({
        title: "❌ Placa Não Encontrada",
        description: error.message,
        variant: "destructive"
      });
      setVehicleFound(null);
      setShowManualForm(true);
    } finally {
      setIsSearchingPlate(false);
    }
  };

  const handleMakeChange = (makeId) => {
    const make = carMakes.find(m => m.id === makeId);
    setSelectedMake(make);
    setQuoteForm({ ...quoteForm, make: makeId, model: '' });
  };

  const handleGetQuote = (e) => {
    e.preventDefault();
    
    if (!vehicleFound && !showManualForm) {
      toast({
        title: "Atenção",
        description: "Por favor, busque a placa do veículo primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to search/booking page with quote data
    navigate('/search', { state: { quoteData: quoteForm } });
  };

  const handleResetPlateSearch = () => {
    setPlateInput('');
    setVehicleFound(null);
    setShowManualForm(false);
    setQuoteForm({
      plate: '',
      make: '',
      model: '',
      year: '',
      color: '',
      fuel: '',
      version: '',
      category: '',
      service: '',
      location: '',
      description: ''
    });
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
            <p className="text-xl text-gray-600">Comece digitando a placa do seu veículo</p>
          </div>

          <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-white to-[#F5F7FA]">
            {/* Plate Search Section */}
            {!vehicleFound && !showManualForm && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1EC6C6] to-[#1AB5B5] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0E1A2C] mb-2">Digite a Placa do Veículo</h3>
                  <p className="text-gray-600">Buscaremos automaticamente as informações do seu carro</p>
                </div>

                <div className="max-w-md mx-auto space-y-4">
                  <div className="space-y-2">
                    <Input 
                      placeholder="ABC-1234 ou ABC1234"
                      value={plateInput}
                      onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
                      className="h-16 text-center text-2xl font-bold tracking-wider"
                      maxLength={8}
                      disabled={isSearchingPlate}
                    />
                    <p className="text-xs text-gray-500 text-center">
                      Placas para teste: ABC-1234, DEF-5678, GHI-9012, JKL-3456
                    </p>
                  </div>

                  <Button 
                    onClick={handlePlateSearch}
                    disabled={isSearchingPlate}
                    size="lg" 
                    className="w-full h-14 bg-gradient-to-r from-[#1EC6C6] to-[#1AB5B5] hover:from-[#1AB5B5] hover:to-[#1EC6C6] text-white text-lg font-semibold shadow-lg"
                  >
                    {isSearchingPlate ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Buscando Placa...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Buscar Veículo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Vehicle Found - Show Details */}
            {vehicleFound && (
              <div className="space-y-6">
                {/* Vehicle Info Card */}
                <Card className="p-6 bg-gradient-to-br from-[#27AE60]/10 to-white border-2 border-[#27AE60]/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#27AE60] rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#0E1A2C]">Veículo Identificado</h3>
                        <p className="text-sm text-gray-600">Placa: {vehicleFound.plate}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleResetPlateSearch}
                    >
                      Alterar
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-600">Marca/Modelo</div>
                      <div className="font-bold text-[#0E1A2C]">{vehicleFound.makeName} {vehicleFound.model}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Ano</div>
                      <div className="font-bold text-[#0E1A2C]">{vehicleFound.year}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Cor</div>
                      <div className="font-bold text-[#0E1A2C]">{vehicleFound.color}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Combustível</div>
                      <div className="font-bold text-[#0E1A2C]">{vehicleFound.fuel}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Versão</div>
                      <div className="font-bold text-[#0E1A2C]">{vehicleFound.version}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Categoria</div>
                      <div className="font-bold text-[#0E1A2C]">{vehicleFound.category}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Potência</div>
                      <div className="font-bold text-[#0E1A2C]">{vehicleFound.power}</div>
                    </div>
                  </div>
                </Card>

                {/* Service Form */}
                <form onSubmit={handleGetQuote} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Service Type */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#0E1A2C]">{t('home.quote.serviceType')} *</label>
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

                    {/* Location */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#0E1A2C]">{t('home.quote.location')} *</label>
                      <Input 
                        required
                        placeholder="Ex: São Paulo, SP" 
                        value={quoteForm.location}
                        onChange={(e) => setQuoteForm({...quoteForm, location: e.target.value})}
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#0E1A2C]">{t('home.quote.description')}</label>
                    <Textarea 
                      placeholder="Descreva o problema ou serviço necessário... (opcional)"
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
              </div>
            )}

            {/* Manual Form (if plate not found) */}
            {showManualForm && (
              <div className="space-y-6">
                <Card className="p-6 bg-[#E84141]/10 border-2 border-[#E84141]/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-[#E84141] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-[#0E1A2C] mb-1">Placa Não Encontrada</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Não conseguimos localizar o veículo com a placa <strong>{plateInput}</strong>. 
                        Por favor, preencha os dados manualmente.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleResetPlateSearch}
                      >
                        Tentar Outra Placa
                      </Button>
                    </div>
                  </div>
                </Card>

                <form onSubmit={handleGetQuote} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Car Make */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#0E1A2C]">{t('home.quote.carMake')} *</label>
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
                      <label className="text-sm font-semibold text-[#0E1A2C]">{t('home.quote.carModel')} *</label>
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
                      <label className="text-sm font-semibold text-[#0E1A2C]">{t('home.quote.carYear')} *</label>
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
                      <label className="text-sm font-semibold text-[#0E1A2C]">{t('home.quote.serviceType')} *</label>
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
                    <label className="text-sm font-semibold text-[#0E1A2C]">{t('home.quote.location')} *</label>
                    <Input 
                      required
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
              </div>
            )}
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
