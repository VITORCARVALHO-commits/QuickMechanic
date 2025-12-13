import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SendQuoteModal } from '../components/SendQuoteModal';
import { toast } from '../hooks/use-toast';
import { Car, MapPin, Clock, CheckCircle, Loader2, DollarSign, AlertCircle, Calendar } from 'lucide-react';

export const MechanicDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('new');
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      // Get available orders (pending)
      const availableRes = await fetch(`${API_URL}/api/mechanic/available-orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const availableData = await availableRes.json();
      if (availableData.success) {
        setAvailableOrders(availableData.data);
      }

      // Get my orders
      const myRes = await fetch(`${API_URL}/api/quotes/my-quotes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const myData = await myRes.json();
      if (myData.success) {
        setMyOrders(myData.data);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar pedidos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuote = (order) => {
    setSelectedOrder(order);
    setShowQuoteModal(true);
  };

  const handleQuoteSent = () => {
    setShowQuoteModal(false);
    loadOrders();
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      quoted: 'bg-blue-100 text-blue-800',
      approved: 'bg-purple-100 text-purple-800',
      paid: 'bg-green-100 text-green-800',
      in_progress: 'bg-orange-100 text-orange-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0E1A2C]">Painel do Mecânico</h1>
          <p className="text-gray-600">Olá, {user?.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Novos Pedidos</p>
                <p className="text-3xl font-bold text-[#1EC6C6]">{availableOrders.length}</p>
              </div>
              <AlertCircle className="h-12 w-12 text-[#1EC6C6]" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Meus Pedidos</p>
                <p className="text-3xl font-bold text-[#27AE60]">{myOrders.length}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-[#27AE60]" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-3xl font-bold text-yellow-500">{user?.rating || '-'} ⭐</p>
              </div>
              <DollarSign className="h-12 w-12 text-yellow-500" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setActiveTab('new')}
            className={activeTab === 'new' ? 'bg-[#1EC6C6]' : 'bg-gray-200 text-gray-700'}
          >
            Novos Pedidos ({availableOrders.length})
          </Button>
          <Button
            onClick={() => setActiveTab('my')}
            className={activeTab === 'my' ? 'bg-[#1EC6C6]' : 'bg-gray-200 text-gray-700'}
          >
            Meus Pedidos ({myOrders.length})
          </Button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {activeTab === 'new' && availableOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0E1A2C]">Pedido #{order.id.slice(0,8)}</h3>
                  <Badge className={getStatusBadge(order.status)}>{order.status}</Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-gray-500" />
                  <span>{order.make} {order.model} ({order.year})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{order.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span>{order.date} às {order.time}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm"><strong>Serviço:</strong> {order.service}</p>
                {order.description && (
                  <p className="text-sm mt-1"><strong>Detalhes:</strong> {order.description}</p>
                )}
              </div>

              <Button
                onClick={() => handleSendQuote(order)}
                className="w-full bg-[#27AE60] hover:bg-[#229954]"
              >
                <DollarSign className="h-5 w-5 mr-2" />
                Enviar Orçamento
              </Button>
            </Card>
          ))}

          {activeTab === 'my' && myOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0E1A2C]">Pedido #{order.id.slice(0,8)}</h3>
                  <Badge className={getStatusBadge(order.status)}>{order.status}</Badge>
                </div>
                {order.final_price && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Orçamento</p>
                    <p className="text-xl font-bold text-[#1EC6C6]">R$ {order.final_price.toFixed(2)}</p>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-gray-500" />
                  <span>{order.make} {order.model}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{order.location}</span>
                </div>
              </div>
            </Card>
          ))}

          {activeTab === 'new' && availableOrders.length === 0 && (
            <Card className="p-12 text-center">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum pedido disponível no momento</p>
            </Card>
          )}

          {activeTab === 'my' && myOrders.length === 0 && (
            <Card className="p-12 text-center">
              <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Você ainda não tem pedidos</p>
            </Card>
          )}
        </div>
      </div>

      {showQuoteModal && selectedOrder && (
        <SendQuoteModal
          order={selectedOrder}
          onClose={() => setShowQuoteModal(false)}
          onSuccess={handleQuoteSent}
        />
      )}
    </div>
  );
};
