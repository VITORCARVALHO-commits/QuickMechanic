import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { ReviewModal } from '../components/ReviewModal';
import { toast } from '../hooks/use-toast';
import { Car, MapPin, Clock, DollarSign, Loader2, CheckCircle, X, Star } from 'lucide-react';

export const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/quotes/my-quotes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
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

  const handleApprove = async (orderId) => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/quotes/${orderId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "✅ Orçamento Aprovado!",
          description: "Prossiga para o pagamento"
        });
        // Redirect to Stripe payment
        navigate(`/payment/${orderId}`);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleReject = async (orderId) => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/quotes/${orderId}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Orçamento Recusado",
          description: "Pedido voltou para status pendente"
        });
        loadOrders();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleReview = (order) => {
    setSelectedOrder(order);
    setShowReviewModal(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      quoted: 'bg-blue-100 text-blue-800',
      approved: 'bg-purple-100 text-purple-800',
      paid: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      reviewed: 'bg-pink-100 text-pink-800'
    };
    const labels = {
      pending: 'Aguardando',
      quoted: 'Orçamento Recebido',
      approved: 'Aprovado',
      paid: 'Pago',
      completed: 'Concluído',
      reviewed: 'Avaliado'
    };
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
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
          <h1 className="text-3xl font-bold text-[#0E1A2C]">Meus Pedidos</h1>
          <p className="text-gray-600">Olá, {user?.name}</p>
        </div>

        <Button
          onClick={() => navigate('/')}
          className="mb-6 bg-[#1EC6C6] hover:bg-[#1AB5B5]"
        >
          + Novo Pedido
        </Button>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0E1A2C]">Pedido #{order.id.slice(0,8)}</h3>
                  {getStatusBadge(order.status)}
                </div>
                {order.final_price && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Valor</p>
                    <p className="text-2xl font-bold text-[#1EC6C6]">R$ {order.final_price.toFixed(2)}</p>
                  </div>
                )}
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
              </div>

              {order.status === 'quoted' && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleReject(order.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Recusar
                  </Button>
                  <Button
                    onClick={() => handleApprove(order.id)}
                    className="flex-1 bg-[#27AE60] hover:bg-[#229954]"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Aprovar e Pagar
                  </Button>
                </div>
              )}

              {order.status === 'completed' && (
                <Button
                  onClick={() => handleReview(order)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600"
                >
                  <Star className="h-5 w-5 mr-2" />
                  Avaliar Serviço
                </Button>
              )}

              {order.status === 'reviewed' && (
                <div className="text-center text-gray-600">
                  ✅ Serviço avaliado
                </div>
              )}
            </Card>
          ))}

          {orders.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-gray-600 mb-4">Você ainda não tem pedidos</p>
              <Button onClick={() => navigate('/')} className="bg-[#1EC6C6]">
                Fazer Primeiro Pedido
              </Button>
            </Card>
          )}
        </div>
      </div>

      {showReviewModal && selectedOrder && (
        <ReviewModal
          order={selectedOrder}
          mechanicName="Mecânico"
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            setShowReviewModal(false);
            loadOrders();
          }}
        />
      )}
    </div>
  );
};
