import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Star, MapPin, Award, Wrench, CheckCircle, Calendar } from 'lucide-react';
import { mockMechanics, serviceTypes } from '../utils/mockData';

export const MechanicProfile = () => {
  const { mechanicId } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const mechanic = mockMechanics.find(m => m.id === mechanicId);

  if (!mechanic) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Mecânico não encontrado.</p>
          <Button onClick={() => navigate('/search')}>{t('common.search')}</Button>
        </Card>
      </div>
    );
  }

  const getServiceName = (serviceId) => {
    const service = serviceTypes.find(s => s.id === serviceId);
    return service?.name[language] || serviceId;
  };

  const ratingDistribution = [
    { stars: 5, percentage: 85 },
    { stars: 4, percentage: 10 },
    { stars: 3, percentage: 3 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1EC6C6] to-[#1AB5B5] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <img
              src={mechanic.photo}
              alt={mechanic.name}
              className="w-40 h-40 rounded-2xl object-cover shadow-2xl border-4 border-white"
            />
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-4xl font-bold mb-3">{mechanic.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <Star className="h-5 w-5 fill-white text-white" />
                  <span className="font-bold text-xl">{mechanic.rating}</span>
                  <span>({mechanic.reviewCount} {t('common.reviews')})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{mechanic.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span>{mechanic.yearsExperience} anos</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {mechanic.mobile && (
                  <Badge className="bg-white/20 text-white border-white/40 px-3 py-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    Atende em Casa
                  </Badge>
                )}
                {mechanic.workshop && (
                  <Badge className="bg-white/20 text-white border-white/40 px-3 py-1">
                    <Wrench className="h-3 w-3 mr-1" />
                    Oficina
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <Button
                size="lg"
                className="bg-white text-[#1EC6C6] hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl"
                onClick={() => navigate('/search')}
              >
                <Calendar className="h-5 w-5 mr-2" />
                {t('common.bookNow')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">Sobre</h2>
              <p className="text-gray-700 leading-relaxed">{mechanic.about}</p>
            </Card>

            {/* Specialties */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">Especialidades</h2>
              <div className="grid grid-cols-2 gap-4">
                {mechanic.specialties.map(specialty => (
                  <div key={specialty} className="flex items-center gap-3 p-4 bg-[#F5F7FA] rounded-lg">
                    <CheckCircle className="h-5 w-5 text-[#27AE60]" />
                    <span className="font-medium text-[#0E1A2C]">{getServiceName(specialty)}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Certifications */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">Certificações</h2>
              <div className="space-y-3">
                {mechanic.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-[#1EC6C6]/5 rounded-lg border-l-4 border-[#1EC6C6]">
                    <Award className="h-6 w-6 text-[#1EC6C6]" />
                    <span className="font-medium text-[#0E1A2C]">{cert}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Reviews */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#0E1A2C] mb-6">{t('common.reviews')}</h2>
              
              {mechanic.reviews.length > 0 ? (
                <div className="space-y-6">
                  {mechanic.reviews.map(review => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-[#0E1A2C]">{review.user}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-[#FF9F1C] text-[#FF9F1C]'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">Nenhuma avaliação ainda.</p>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Rating Breakdown */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-[#0E1A2C] mb-4">Avaliações</h3>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-[#1EC6C6]">{mechanic.rating}</div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-[#FF9F1C] text-[#FF9F1C]" />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {mechanic.reviewCount} {t('common.reviews')}
                  </div>
                </div>
                <div className="space-y-3">
                  {ratingDistribution.map(({ stars, percentage }) => (
                    <div key={stars} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm font-medium">{stars}</span>
                        <Star className="h-3 w-3 fill-[#FF9F1C] text-[#FF9F1C]" />
                      </div>
                      <Progress value={percentage} className="flex-grow h-2" />
                      <span className="text-sm text-gray-600 w-12 text-right">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-[#0E1A2C] mb-4">Estatísticas</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Taxa de Aprovação</span>
                    <span className="font-bold text-[#27AE60]">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tempo de Resposta</span>
                    <span className="font-bold text-[#1EC6C6]">2 horas</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Serviços Realizados</span>
                    <span className="font-bold text-[#0E1A2C]">250+</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
