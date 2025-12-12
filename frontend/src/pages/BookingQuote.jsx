import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Calendar } from '../components/ui/calendar';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';
import { 
  Car, CheckCircle, Clock, MapPin, Calendar as CalendarIcon,
  Wrench, Shield, ChevronRight, AlertCircle, Loader2,
  Home, Building2, Droplet, Disc, Gauge, Battery,
  Zap, Wind, Cog, FileText, CreditCard, Info
} from 'lucide-react';
import { serviceTypes } from '../utils/mockData';
import { createQuote, createPayment } from '../services/api';

export const BookingQuote = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { vehicleData, plateSearch } = location.state || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState({
    serviceType: '',
    postcode: '',
    locationType: 'mobile', // mobile or workshop
    date: null,
    time: '',
    notes: '',
    travelFee: 0
  });
  const [loading, setLoading] = useState(false);
  const [showPrebookingModal, setShowPrebookingModal] = useState(false);
  const [showPixPayment, setShowPixPayment] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  // Service icons mapping
  const serviceIcons = {
    'oil_change': Droplet,
    'brakes': Disc,
    'diagnostic': Gauge,
    'battery': Battery,
    'electrical': Zap,
    'air_conditioning': Wind,
    'transmission': Cog,
    'maintenance': Wrench,
    'engine': Cog,
    'suspension': Cog,
    'clutch': Cog,
    'mot': FileText,
    'tyres': Disc,
    'exhaust': Wind
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const getServiceIcon = (serviceId) => {
    const Icon = serviceIcons[serviceId] || Wrench;
    return Icon;
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setBookingData({ ...bookingData, serviceType: service.id });
    setCurrentStep(2);
  };

  const handlePixPaymentComplete = async () => {
    try {
      // Process payment
      const paymentResult = await createPayment({
        quote_id: currentOrderId,
        amount: 50,
        payment_method: 'pix',
        payment_type: 'prebooking'
      });

      if (paymentResult.success) {
        toast({
          title: "✅ Pré-Reserva Confirmada!",
          description: "R$ 50 pagos via PIX. Você receberá propostas de mecânicos em breve.",
        });

        localStorage.removeItem('pendingBooking');

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao processar pagamento",
        variant: "destructive"
      });
    }
  };

  const handleConfirmBooking = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Save vehicle data and booking state to localStorage
      localStorage.setItem('pendingBooking', JSON.stringify({
        vehicleData,
        bookingData,
        selectedService
      }));
      
      toast({
        title: "Login Required",
        description: "Please login or create an account to continue",
      });
      
      navigate('/login', { state: { from: '/quote', vehicleData } });
      return;
    }

    if (!bookingData.postcode || !bookingData.date || !bookingData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Show pre-booking modal
    setShowPrebookingModal(true);
  };

  const handlePrebookingPayment = async () => {
    setLoading(true);

    try {
      const quotePayload = {
        plate: vehicleData?.plate || plateSearch,
        make: vehicleData?.make || '',
        model: vehicleData?.model || 'Unknown',
        year: vehicleData?.year || '',
        color: vehicleData?.color || '',
        fuel: vehicleData?.fuel || '',
        version: vehicleData?.version || '',
        category: vehicleData?.category || '',
        service: selectedService.id,
        location: bookingData.postcode,
        description: bookingData.notes,
        date: bookingData.date?.toISOString().split('T')[0],
        time: bookingData.time,
        location_type: bookingData.locationType
      };

      // Add vehicle_id to payload (need to create vehicle first)
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');
      
      // Create vehicle record
      const vehicleResponse = await fetch(`${API_URL}/api/vehicles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plate: vehicleData?.plate || plateSearch,
          make: vehicleData?.make || '',
          model: vehicleData?.model || 'Unknown',
          year: vehicleData?.year || ''
        })
      });
      
      const vehicleResult = await vehicleResponse.json();
      
      // Create order with has_parts flag
      const orderPayload = {
        vehicle_id: vehicleResult.data.id,
        service: selectedService.id,
        location: bookingData.postcode,
        description: bookingData.notes,
        date: bookingData.date?.toISOString().split('T')[0],
        time: bookingData.time,
        location_type: bookingData.locationType
      };

      const orderResponse = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      const quoteResult = await orderResponse.json();

      if (quoteResult.success) {
        // Save order ID and show PIX payment
        setCurrentOrderId(quoteResult.data.id);
        setShowPrebookingModal(false);
        setShowPixPayment(true);
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Error",
        description: "Failed to process pre-booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setShowPrebookingModal(false);
    }
  };

  if (!vehicleData) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-[#E84141] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-2">No Vehicle Data</h2>
          <p className="text-gray-600 mb-6">Please search for a vehicle first.</p>
          <Button onClick={() => navigate('/')} className="bg-[#1EC6C6] hover:bg-[#1AB5B5]">
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {[
              { num: 1, label: 'Vehicle' },
              { num: 2, label: 'Service' },
              { num: 3, label: 'Schedule' },
              { num: 4, label: 'Confirm' }
            ].map((step, index) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep >= step.num 
                      ? 'bg-[#1EC6C6] text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.num ? <CheckCircle className="h-6 w-6" /> : step.num}
                  </div>
                  <span className={`text-sm mt-2 ${currentStep >= step.num ? 'text-[#1EC6C6] font-semibold' : 'text-gray-500'}`}>
                    {step.label}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`flex-1 h-1 mx-4 rounded transition-all ${
                    currentStep > step.num ? 'bg-[#1EC6C6]' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Vehicle Details */}
            <Card className="p-6 bg-gradient-to-br from-[#27AE60]/5 to-white border-2 border-[#27AE60]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#27AE60] rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0E1A2C]">Vehicle Confirmed</h2>
                  <p className="text-sm text-gray-600">Registration: {vehicleData.plate}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <Car className="h-8 w-8 text-[#1EC6C6]" />
                  <div>
                    <h3 className="text-2xl font-bold text-[#0E1A2C]">
                      {vehicleData.make_name} {vehicleData.model}
                    </h3>
                    <p className="text-gray-600">{vehicleData.version}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Year', value: vehicleData.year },
                    { label: 'Colour', value: vehicleData.color },
                    { label: 'Fuel', value: vehicleData.fuel },
                    { label: 'Body Type', value: vehicleData.category },
                    { label: 'Engine', value: vehicleData.engine_size || 'N/A' },
                    { label: 'Power', value: vehicleData.power || 'N/A' },
                    { label: 'CO2', value: vehicleData.co2 || 'N/A' },
                    { label: 'Doors', value: vehicleData.doors || 'N/A' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-2 bg-[#F5F7FA] rounded">
                      <div className="text-xs text-gray-500">{item.label}</div>
                      <div className="font-semibold text-[#0E1A2C] text-sm">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Step 2: Service Selection */}
            {currentStep >= 1 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">Select Your Service</h2>
                <p className="text-gray-600 mb-6">Choose the service you need for your vehicle</p>

                <div className="grid md:grid-cols-2 gap-4">
                  {serviceTypes.map((service) => {
                    const Icon = getServiceIcon(service.id);
                    const isSelected = selectedService?.id === service.id;

                    return (
                      <button
                        key={service.id}
                        onClick={() => handleServiceSelect(service)}
                        className={`p-4 border-2 rounded-xl text-left transition-all hover:shadow-md ${
                          isSelected
                            ? 'border-[#1EC6C6] bg-[#1EC6C6]/5 shadow-lg'
                            : 'border-gray-200 hover:border-[#1EC6C6]/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-[#1EC6C6]' : 'bg-gray-100'
                          }`}>
                            <Icon className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-[#0E1A2C] mb-1">{service.name.en}</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-[#1EC6C6]">£{service.basePrice}</span>
                              <span className="text-sm text-gray-500">estimated</span>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle className="h-6 w-6 text-[#1EC6C6] flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Step 3: Location & Schedule */}
            {currentStep >= 2 && selectedService && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">Where & When?</h2>

                {/* Location Type */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-[#0E1A2C] mb-3 block">Service Location</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setBookingData({...bookingData, locationType: 'mobile'})}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        bookingData.locationType === 'mobile'
                          ? 'border-[#1EC6C6] bg-[#1EC6C6]/5'
                          : 'border-gray-200 hover:border-[#1EC6C6]/50'
                      }`}
                    >
                      <Home className="h-8 w-8 text-[#1EC6C6] mb-2" />
                      <div className="font-bold text-[#0E1A2C]">Mobile Service</div>
                      <div className="text-sm text-gray-600">We come to you</div>
                    </button>
                    <button
                      onClick={() => setBookingData({...bookingData, locationType: 'workshop'})}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        bookingData.locationType === 'workshop'
                          ? 'border-[#1EC6C6] bg-[#1EC6C6]/5'
                          : 'border-gray-200 hover:border-[#1EC6C6]/50'
                      }`}
                    >
                      <Building2 className="h-8 w-8 text-[#1EC6C6] mb-2" />
                      <div className="font-bold text-[#0E1A2C]">Workshop</div>
                      <div className="text-sm text-gray-600">Visit garage</div>
                    </button>
                  </div>
                </div>

                {/* Postcode */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
                    {bookingData.locationType === 'mobile' ? 'Your Postcode' : 'Workshop Postcode'}
                  </label>
                  <Input
                    placeholder="e.g. SW1A 1AA"
                    value={bookingData.postcode}
                    onChange={(e) => setBookingData({...bookingData, postcode: e.target.value.toUpperCase()})}
                    className="h-12 text-lg"
                  />
                </div>

                {/* Date Selection */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Select Date</label>
                  <div className="border rounded-lg p-4 bg-white">
                    <Calendar
                      mode="single"
                      selected={bookingData.date}
                      onSelect={(date) => setBookingData({...bookingData, date})}
                      disabled={(date) => date < new Date()}
                      className="mx-auto"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Preferred Time</label>
                  <div className="grid grid-cols-5 gap-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setBookingData({...bookingData, time})}
                        className={`p-3 border-2 rounded-lg font-semibold transition-all ${
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

                {/* Additional Notes */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Additional Notes (Optional)</label>
                  <Textarea
                    placeholder="Any specific details about the issue or requirements..."
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={() => setCurrentStep(4)}
                  disabled={!bookingData.postcode || !bookingData.date || !bookingData.time}
                  className="w-full h-12 bg-[#1EC6C6] hover:bg-[#1AB5B5] text-white font-semibold"
                >
                  Continue to Summary
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </Card>
            )}
          </div>

          {/* Pre-booking Modal */}
          {showPrebookingModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="max-w-md w-full p-6 bg-white">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#1EC6C6] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#0E1A2C] mb-2">Confirm Pre-Booking</h2>
                  <p className="text-gray-600">Secure your booking with a £12 deposit</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">How it works:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Pay £12 now to confirm your booking</li>
                        <li>This will be <strong>deducted from your final bill</strong></li>
                        <li>If you cancel, the £12 is <strong>non-refundable</strong></li>
                        <li>Prevents fake bookings</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center p-3 bg-[#F5F7FA] rounded-lg">
                    <span className="text-gray-700">Pre-booking Fee</span>
                    <span className="text-2xl font-bold text-[#1EC6C6]">£12.00</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowPrebookingModal(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePrebookingPayment}
                    disabled={loading}
                    className="flex-1 bg-[#27AE60] hover:bg-[#229954] text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Pay £12
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Price Summary */}
              {selectedService && (
                <Card className="p-6 bg-gradient-to-br from-[#1EC6C6]/5 to-white border-2 border-[#1EC6C6]/20">
                  <h3 className="text-lg font-bold text-[#0E1A2C] mb-4">Booking Summary</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600">Service</div>
                      <div className="font-bold text-[#0E1A2C]">{selectedService.name.en}</div>
                    </div>

                    {bookingData.postcode && (
                      <div>
                        <div className="text-sm text-gray-600">Location</div>
                        <div className="font-bold text-[#0E1A2C]">{bookingData.postcode}</div>
                      </div>
                    )}

                    {bookingData.date && (
                      <div>
                        <div className="text-sm text-gray-600">Date & Time</div>
                        <div className="font-bold text-[#0E1A2C]">
                          {bookingData.date.toLocaleDateString('en-GB')} at {bookingData.time}
                        </div>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Labour</span>
                        <span className="font-semibold">£{selectedService.basePrice}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                        <span>Parts</span>
                        <span>If required</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-[#0E1A2C]">Estimated Total</span>
                        <span className="text-3xl font-bold text-[#1EC6C6]">£{selectedService.basePrice}</span>
                      </div>
                    </div>
                  </div>

                  {currentStep === 4 && (
                    <Button
                      onClick={handleConfirmBooking}
                      disabled={loading}
                      className="w-full mt-6 h-14 bg-gradient-to-r from-[#1EC6C6] to-[#1AB5B5] hover:from-[#1AB5B5] hover:to-[#1EC6C6] text-white text-lg font-bold shadow-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Confirm Booking
                          <ChevronRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </Card>
              )}

              {/* Guarantee Badge */}
              <Card className="p-6 bg-gradient-to-br from-[#27AE60]/5 to-white border-2 border-[#27AE60]/20">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#27AE60] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-[#0E1A2C] mb-2">12-Month Guarantee</h4>
                  <p className="text-sm text-gray-600">All work covered with our comprehensive warranty</p>
                </div>
              </Card>

              {/* Trust Indicators */}
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#27AE60]" />
                    <span className="text-sm text-gray-700">Verified mechanics only</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#27AE60]" />
                    <span className="text-sm text-gray-700">Fixed price guarantee</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#27AE60]" />
                    <span className="text-sm text-gray-700">Pay after completion</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Pre-booking Modal */}
        {showPrebookingModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full p-6 bg-white">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#1EC6C6] rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#0E1A2C] mb-2">Confirmar Pré-Reserva</h2>
              <p className="text-gray-600">Garanta sua reserva com um depósito de R$ 50</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Como funciona:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Pague R$ 50 agora para confirmar sua reserva</li>
                    <li>Será <strong>descontado da conta final</strong></li>
                    <li>Se cancelar, os R$ 50 são <strong>não reembolsáveis</strong></li>
                    <li>Evita reservas falsas</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 bg-[#F5F7FA] rounded-lg">
                <span className="text-gray-700">Taxa de Pré-Reserva</span>
                <span className="text-2xl font-bold text-[#1EC6C6]">R$ 50,00</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowPrebookingModal(false)}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePrebookingPayment}
                disabled={loading}
                className="flex-1 bg-[#27AE60] hover:bg-[#229954] text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Pagar R$ 50
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* PIX Payment Modal */}
      {showPixPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <PaymentPIX
            amount={50}
            onPaymentComplete={handlePixPaymentComplete}
            onCancel={() => setShowPixPayment(false)}
          />
        </div>
      )}
    </div>
  );
};
