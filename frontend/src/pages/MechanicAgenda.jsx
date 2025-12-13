import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Clock, MapPin, Play, Square, CheckCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export const MechanicAgenda = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [date]);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const loadOrders = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');
      const dateStr = date.toISOString().split('T')[0];

      const response = await fetch(`${API_URL}/api/mechanic/agenda?date=${dateStr}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const startService = async (orderId) => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/mechanic/orders/${orderId}/start`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setActiveOrder(orderId);
        setTimer(0);
        setTimerRunning(true);
        toast({ title: "✅ Serviço Iniciado!", description: "Timer ativado" });
        loadOrders();
      }
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  const completeService = async (orderId) => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/mechanic/orders/${orderId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ duration_minutes: Math.floor(timer / 60) })
      });

      const data = await response.json();
      if (data.success) {
        setActiveOrder(null);
        setTimerRunning(false);
        setTimer(0);
        toast({ title: "✅ Serviço Concluído!", description: "Cliente será notificado" });
        loadOrders();
      }
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#1EC6C6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#0E1A2C] mb-8">Minha Agenda</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Calendário</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </Card>

          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-lg">Serviços de {date.toLocaleDateString('pt-BR')}</h3>
            
            {activeOrder && (
              <Card className="p-6 bg-green-50 border-green-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-green-800">Serviço em Andamento</p>
                    <p className="text-3xl font-mono text-green-600">{formatTime(timer)}</p>
                  </div>
                  <Button
                    onClick={() => completeService(activeOrder)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Finalizar
                  </Button>
                </div>
              </Card>
            )}

            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-lg">#{order.id.slice(0, 8)}</h4>
                    <p className="text-gray-600">{order.service}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{order.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{order.location}</span>
                  </div>
                </div>

                {order.status === 'paid' && !activeOrder && (
                  <Button
                    onClick={() => startService(order.id)}
                    className="w-full bg-[#27AE60] hover:bg-[#229954]"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Iniciar Serviço
                  </Button>
                )}

                {order.status === 'in_progress' && order.id === activeOrder && (
                  <p className="text-center text-orange-600 font-semibold">Em andamento...</p>
                )}
              </Card>
            ))}

            {orders.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-gray-600">Nenhum serviço agendado para este dia</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
