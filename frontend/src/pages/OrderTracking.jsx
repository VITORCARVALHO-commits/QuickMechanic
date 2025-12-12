import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';
import { 
  Car, CheckCircle, Clock, MapPin, Wrench, 
  Package, TrendingUp, User, Phone, Mail,
  ArrowLeft, DollarSign, Calendar
} from 'lucide-react';

export const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/quotes/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = () => {
    return [
      { key: 'AGUARDANDO_MECANICO', label: 'Waiting for Mechanic', icon: Clock },
      { key: 'ACEITO', label: 'Accepted by Mechanic', icon: CheckCircle },
      { key: 'AGUARDANDO_RESERVA_PECA', label: 'Part Reservation Pending', icon: Package },
      { key: 'PECA_CONFIRMADA', label: 'Part Confirmed', icon: CheckCircle },
      { key: 'PECA_RETIRADA', label: 'Part Collected', icon: Package },
      { key: 'SERVICO_EM_ANDAMENTO', label: 'Service In Progress', icon: Wrench },
      { key: 'SERVICO_FINALIZADO', label: 'Service Completed', icon: CheckCircle },
      { key: 'PAGAMENTO_CONFIRMADO', label: 'Payment Confirmed', icon: DollarSign }
    ];
  };

  const getCurrentStepIndex = () => {
    const steps = getStatusSteps();
    const currentIndex = steps.findIndex(step => step.key === order?.status);
    return currentIndex >= 0 ? currentIndex : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-[#1EC6C6]">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-2">Order not found</h2>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const statusSteps = getStatusSteps();
  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0E1A2C]">Order Tracking</h1>
              <p className="text-gray-600">Order ID: {order.id.slice(0, 8)}</p>
            </div>
            <Badge className="text-lg px-4 py-2 bg-[#1EC6C6] text-white">
              {order.status.replace(/_/g, ' ')}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Timeline */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-[#0E1A2C] mb-6">Order Progress</h2>
              <div className="space-y-4">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted ? 'bg-[#27AE60] text-white' :
                        isCurrent ? 'bg-[#1EC6C6] text-white' :
                        'bg-gray-200 text-gray-400'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 pt-2">
                        <div className={`font-semibold ${
                          isCompleted ? 'text-[#27AE60]' :
                          isCurrent ? 'text-[#1EC6C6]' :
                          'text-gray-400'
                        }`}>
                          {step.label}
                        </div>
                        {isCurrent && (
                          <div className="text-sm text-gray-600 mt-1">Current status</div>
                        )}
                      </div>
                      {isCompleted && (
                        <CheckCircle className="h-6 w-6 text-[#27AE60]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Parts Info */}
            {order.pickup_code && (
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="text-lg font-bold text-[#0E1A2C] mb-4">Part Pickup Code</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#1EC6C6] font-mono mb-2">
                    {order.pickup_code}
                  </div>
                  <p className="text-sm text-gray-600">
                    Mechanic will use this code to collect the part
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vehicle Info */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-[#0E1A2C] mb-4">Vehicle Details</h3>
              <div className="flex items-center gap-3 mb-4">
                <Car className="h-8 w-8 text-[#1EC6C6]" />
                <div>
                  <div className="font-bold text-[#0E1A2C]">{order.make} {order.model}</div>
                  <div className="text-sm text-gray-600">{order.plate}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-semibold">{order.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-semibold">{order.service.replace('_', ' ').toUpperCase()}</span>
                </div>
              </div>
            </Card>

            {/* Service Info */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-[#0E1A2C] mb-4">Service Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-[#1EC6C6]" />
                  <span className="text-gray-600">{order.location}</span>
                </div>
                {order.date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-[#1EC6C6]" />
                    <span className="text-gray-600">{order.date} at {order.time}</span>
                  </div>
                )}
                {order.description && (
                  <div className="mt-4 p-3 bg-[#F5F7FA] rounded-lg">
                    <div className="text-xs font-semibold text-gray-600 mb-1">Notes:</div>
                    <div className="text-sm text-gray-700">{order.description}</div>
                  </div>
                )}
              </div>
            </Card>

            {/* Pricing */}
            <Card className="p-6 bg-gradient-to-br from-[#1EC6C6]/10 to-white">
              <h3 className="text-lg font-bold text-[#0E1A2C] mb-4">Pricing</h3>
              <div className="space-y-2">
                {order.labor_price && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Labor:</span>
                    <span className="font-semibold">£{order.labor_price.toFixed(2)}</span>
                  </div>
                )}
                {order.part_price && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parts:</span>
                    <span className="font-semibold">£{order.part_price.toFixed(2)}</span>
                  </div>
                )}
                {order.travel_fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travel Fee:</span>
                    <span className="font-semibold">£{order.travel_fee.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#0E1A2C]">Total:</span>
                    <span className="text-2xl font-bold text-[#1EC6C6]">
                      £{(order.final_price || order.estimated_price || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
