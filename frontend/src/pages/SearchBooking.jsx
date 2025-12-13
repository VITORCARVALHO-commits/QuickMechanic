import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Star, MapPin, Award, Wrench, Filter, Loader2 } from 'lucide-react';
import { mockMechanics, serviceTypes, carMakes } from '../utils/mockData';

export const SearchBooking = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [filteredMechanics, setFilteredMechanics] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [filterMobile, setFilterMobile] = useState(false);
  const [filterWorkshop, setFilterWorkshop] = useState(false);

  const quoteData = location.state?.quoteData || {};

  useEffect(() => {
    // Simulate AI price calculation (Brazilian pricing in R$)
    setTimeout(() => {
      const service = serviceTypes.find(s => s.id === quoteData.service);
      const basePrice = service?.basePrice || 500;
      const variation = Math.floor(Math.random() * 100) + 50; // Brazilian variation
      setEstimatedPrice(basePrice + variation);
      
      // Filter mechanics by service
      let mechanics = mockMechanics;
      if (quoteData.service) {
        mechanics = mechanics.filter(m => 
          m.specialties.includes(quoteData.service)
        );
      }
      setFilteredMechanics(mechanics);
      setLoading(false);
    }, 1500);
  }, [quoteData]);

  const handleFilterChange = () => {
    let mechanics = mockMechanics;
    
    if (quoteData.service) {
      mechanics = mechanics.filter(m => 
        m.specialties.includes(quoteData.service)
      );
    }
    
    if (filterMobile && !filterWorkshop) {
      mechanics = mechanics.filter(m => m.mobile);
    } else if (filterWorkshop && !filterMobile) {
      mechanics = mechanics.filter(m => m.workshop);
    }
    
    if (searchLocation) {
      mechanics = mechanics.filter(m => 
        m.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    
    setFilteredMechanics(mechanics);
  };

  useEffect(() => {
    handleFilterChange();
  }, [filterMobile, filterWorkshop, searchLocation]);

  const getServiceName = (serviceId) => {
    const service = serviceTypes.find(s => s.id === serviceId);
    return service?.name[language] || serviceId;
  };

  const getCarMakeName = (makeId) => {
    const make = carMakes.find(m => m.id === makeId);
    return make?.name || makeId;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-[#1EC6C6] animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">{t('common.loading')}</p>
          <p className="text-sm text-gray-500 mt-2">Calculando melhor preço com IA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with Quote Summary */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-[#1EC6C6] to-[#1AB5B5] border-0 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Seu Orçamento</h1>
              <div className="space-y-1 text-white/90">
                <p><strong>Veículo:</strong> {getCarMakeName(quoteData.make)} {quoteData.model} {quoteData.year}</p>
                <p><strong>Serviço:</strong> {getServiceName(quoteData.service)}</p>
                <p><strong>Localização:</strong> {quoteData.location}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/90 mb-1">{t('common.estimated')}</div>
              <div className="text-5xl font-bold">R$ {estimatedPrice}</div>
              <div className="text-sm text-white/90 mt-1">+ peças (se necessário)</div>
            </div>
          </div>
        </Card>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Input 
            placeholder="Filtrar por localização..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="max-w-xs"
          />
          <Button
            variant={filterMobile ? "default" : "outline"}
            onClick={() => setFilterMobile(!filterMobile)}
            className={filterMobile ? "bg-[#1EC6C6] text-white" : ""}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Mecânico Móvel
          </Button>
          <Button
            variant={filterWorkshop ? "default" : "outline"}
            onClick={() => setFilterWorkshop(!filterWorkshop)}
            className={filterWorkshop ? "bg-[#1EC6C6] text-white" : ""}
          >
            <Wrench className="h-4 w-4 mr-2" />
            Oficina
          </Button>
        </div>

        {/* Mechanics List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0E1A2C]">
            {filteredMechanics.length} Mecânicos Disponíveis
          </h2>
          
          {filteredMechanics.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-600">Nenhum mecânico encontrado com esses filtros.</p>
            </Card>
          ) : (
            filteredMechanics.map(mechanic => (
              <Card key={mechanic.id} className="p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-[#1EC6C6]">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Mechanic Photo */}
                  <div className="flex-shrink-0">
                    <img 
                      src={mechanic.photo} 
                      alt={mechanic.name}
                      className="w-32 h-32 rounded-xl object-cover"
                    />
                  </div>

                  {/* Mechanic Info */}
                  <div className="flex-grow">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-[#0E1A2C]">{mechanic.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-[#FF9F1C] text-[#FF9F1C]" />
                            <span className="font-bold text-[#0E1A2C]">{mechanic.rating}</span>
                          </div>
                          <span className="text-gray-600">({mechanic.reviewCount} {t('common.reviews')})</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{mechanic.yearsExperience} anos de experiência</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#1EC6C6]">R$ {estimatedPrice}</div>
                        <div className="text-sm text-gray-600">{t('common.estimated')}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{mechanic.location}</span>
                    </div>

                    <p className="text-gray-700 mb-4">{mechanic.about}</p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mechanic.mobile && (
                        <Badge className="bg-[#1EC6C6]/10 text-[#1EC6C6] hover:bg-[#1EC6C6]/20">
                          <MapPin className="h-3 w-3 mr-1" />
                          Atende em Casa
                        </Badge>
                      )}
                      {mechanic.workshop && (
                        <Badge className="bg-[#FF9F1C]/10 text-[#FF9F1C] hover:bg-[#FF9F1C]/20">
                          <Wrench className="h-3 w-3 mr-1" />
                          Oficina
                        </Badge>
                      )}
                      {mechanic.certifications.map((cert, idx) => (
                        <Badge key={idx} variant="outline" className="border-[#27AE60] text-[#27AE60]">
                          <Award className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button 
                        className="bg-[#1EC6C6] hover:bg-[#1AB5B5] text-white"
                        onClick={() => navigate(`/booking/${mechanic.id}`, { 
                          state: { mechanic, quoteData, estimatedPrice } 
                        })}
                      >
                        {t('common.bookNow')}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/mechanic/${mechanic.id}`)}
                      >
                        {t('common.viewDetails')}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
