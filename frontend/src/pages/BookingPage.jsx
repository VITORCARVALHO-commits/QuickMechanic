import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Calendar } from '../components/ui/calendar';
import { toast } from '../hooks/use-toast';
import { Star, MapPin, Calendar as CalendarIcon, Clock, CreditCard } from 'lucide-react';

export const BookingPage = () => {
  const { mechanicId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const { mechanic, quoteData, estimatedPrice } = location.state || {};
  
  const [bookingData, setBookingData] = useState({
    date: null,
    time: '',
    address: quoteData?.location || '',
    notes: quoteData?.description || '',
    serviceType: 'mobile'
  });

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleBooking = (e) => {
    e.preventDefault();
    
    if (!bookingData.date || !bookingData.time) {
      toast({
        title: "Erro",
        description: "Por favor, selecione data e horário.",
        variant: "destructive"
      });
      return;
    }

    // Simulate booking creation
    toast({
      title: "✅ Agendamento Confirmado!",
      description: `Seu serviço com ${mechanic.name} foi agendado para ${bookingData.date.toLocaleDateString('pt-BR')} às ${bookingData.time}.`
    });

    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (!mechanic) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Dados do mecânico não encontrados.</p>
          <Button onClick={() => navigate('/search')}>{t('common.search')}</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-[#0E1A2C] mb-8">{t('booking.title')}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <form onSubmit={handleBooking} className="space-y-6">
                {/* Service Type Selection */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-[#0E1A2C]">
                    Tipo de Atendimento
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {mechanic.mobile && (
                      <button
                        type="button"
                        onClick={() => setBookingData({...bookingData, serviceType: 'mobile'})}
                        className={`p-6 border-2 rounded-xl text-left transition-all duration-300 ${
                          bookingData.serviceType === 'mobile'
                            ? 'border-[#1EC6C6] bg-[#1EC6C6]/5'
                            : 'border-gray-200 hover:border-[#1EC6C6]/50'
                        }`}
                      >
                        <MapPin className="h-6 w-6 text-[#1EC6C6] mb-2" />
                        <div className="font-semibold text-[#0E1A2C]">{t('booking.mobile')}</div>
                        <div className="text-sm text-gray-600 mt-1">Mecânico vai até você</div>
                      </button>
                    )}
                    {mechanic.workshop && (
                      <button
                        type="button"
                        onClick={() => setBookingData({...bookingData, serviceType: 'workshop'})}
                        className={`p-6 border-2 rounded-xl text-left transition-all duration-300 ${
                          bookingData.serviceType === 'workshop'
                            ? 'border-[#1EC6C6] bg-[#1EC6C6]/5'
                            : 'border-gray-200 hover:border-[#1EC6C6]/50'
                        }`}
                      >
                        <MapPin className="h-6 w-6 text-[#1EC6C6] mb-2" />
                        <div className="font-semibold text-[#0E1A2C]">{t('booking.workshop')}</div>
                        <div className="text-sm text-gray-600 mt-1">Levar carro até oficina</div>
                      </button>
                    )}
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-lg font-semibold text-[#0E1A2C] flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {t('booking.selectDate')}
                  </label>
                  <div className="border rounded-xl p-4 bg-white">
                    <Calendar
                      mode="single"
                      selected={bookingData.date}
                      onSelect={(date) => setBookingData({...bookingData, date})}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="mx-auto"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <label className="text-lg font-semibold text-[#0E1A2C] flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {t('booking.selectTime')}
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setBookingData({...bookingData, time})}
                        className={`p-3 border-2 rounded-lg font-semibold transition-all duration-300 ${
                          bookingData.time === time
                            ? 'border-[#1EC6C6] bg-[#1EC6C6] text-white'
                            : 'border-gray-200 hover:border-[#1EC6C6] text-[#0E1A2C]'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address */}
                {bookingData.serviceType === 'mobile' && (
                  <div className="space-y-2">
                    <label className="text-lg font-semibold text-[#0E1A2C]">
                      {t('booking.address')}
                    </label>
                    <Input
                      placeholder="Rua, número, bairro, cidade..."
                      value={bookingData.address}
                      onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
                      className="h-12"
                      required
                    />
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-lg font-semibold text-[#0E1A2C]">
                    {t('booking.notes')}
                  </label>
                  <Textarea
                    placeholder="Informações adicionais sobre o problema ou preferências..."
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 bg-gradient-to-r from-[#1EC6C6] to-[#1AB5B5] hover:from-[#1AB5B5] hover:to-[#1EC6C6] text-white text-lg font-semibold shadow-lg"
                >
                  {t('booking.confirm')}
                </Button>
              </form>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Mechanic Card */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-[#0E1A2C] mb-4">Mecânico</h3>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={mechanic.photo}
                    alt={mechanic.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-[#0E1A2C]">{mechanic.name}</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-[#FF9F1C] text-[#FF9F1C]" />
                      <span>{mechanic.rating}</span>
                      <span className="text-gray-500">({mechanic.reviewCount})</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    {mechanic.location}
                  </div>
                </div>
              </Card>

              {/* Price Summary */}
              <Card className="p-6 bg-gradient-to-br from-[#1EC6C6]/5 to-white border-2 border-[#1EC6C6]/20">
                <h3 className="text-lg font-semibold text-[#0E1A2C] mb-4">Resumo do Orçamento</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Mão de Obra</span>
                    <span className="font-semibold">R$ {estimatedPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Peças (se necessário)</span>
                    <span>A definir</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-[#0E1A2C]">Total Estimado</span>
                      <span className="text-3xl font-bold text-[#1EC6C6]">R$ {estimatedPrice}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-[#27AE60]/10 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-[#27AE60]">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-semibold">Pay after job completion</span>
                  </div>
                </div>
              </Card>

              {/* Convenience */}
              <Card className="p-6 bg-gradient-to-br from-[#27AE60]/5 to-white border-2 border-[#27AE60]/20">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#27AE60] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-[#0E1A2C] mb-2">Comodidade e Rapidez</h4>
                  <p className="text-sm text-gray-600">Sem sair de casa</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
