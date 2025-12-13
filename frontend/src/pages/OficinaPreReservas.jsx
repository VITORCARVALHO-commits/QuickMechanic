import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from '../hooks/use-toast';
import { Clock, CheckCircle, XCircle, Package, User } from 'lucide-react';

export const OficinaPreReservas = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [pickupCode, setPickupCode] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/reservations/my-reservations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setReservations(data.reservations);
      }
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (reservationId) => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/reservations/${reservationId}/confirm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'confirmed' })
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Pré-Reserva Confirmada",
          description: `Código de retirada: ${data.pickup_code}`,
        });
        loadReservations();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao confirmar pré-reserva",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (reservationId) => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/reservations/${reservationId}/confirm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'rejected' })
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: "Pré-Reserva Recusada" });
        loadReservations();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao recusar",
        variant: "destructive"
      });
    }
  };

  const handlePickup = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/reservations/${selectedReservation.id}/pickup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: pickupCode })
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: "Retirada Confirmada", description: "Estoque atualizado" });
        setShowCodeModal(false);
        setPickupCode('');
        loadReservations();
      } else {
        toast({ title: "Código Inválido", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro ao validar código", variant: "destructive" });
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-[#F39C12]', text: 'Pendente', icon: Clock },
      confirmed: { color: 'bg-[#27AE60]', text: 'Confirmada', icon: CheckCircle },
      rejected: { color: 'bg-[#E84141]', text: 'Recusada', icon: XCircle },
      picked_up: { color: 'bg-[#1EC6C6]', text: 'Retirada', icon: Package }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 ${badge.color} text-white rounded-full text-sm`}>
        <Icon className="h-4 w-4" />
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#0E1A2C] mb-8">Pré-Reservas de Peças</h1>

        {loading ? (
          <div className="text-center py-12">Carregando...</div>
        ) : reservations.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma pré-reserva ainda</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <User className="h-5 w-5 text-[#1EC6C6]" />
                      <div>
                        <p className="font-bold text-[#0E1A2C]">{reservation.mechanic_name}</p>
                        <p className="text-sm text-gray-600">Pedido #{reservation.order_id.slice(0, 8)}</p>
                      </div>
                      {getStatusBadge(reservation.status)}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Peça</p>
                        <p className="font-semibold">{reservation.part_name}</p>
                        {reservation.part_code && <p className="text-xs text-gray-500">{reservation.part_code}</p>}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Quantidade</p>
                        <p className="font-semibold">{reservation.quantity}x</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Valor</p>
                        <p className="font-semibold">R$ {(reservation.price * reservation.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    {reservation.notes && (
                      <p className="text-sm text-gray-600 mb-4">Obs: {reservation.notes}</p>
                    )}
                    {reservation.pickup_code && (
                      <div className="bg-[#1EC6C6]/10 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Código de Retirada:</p>
                        <p className="text-2xl font-bold text-[#1EC6C6]">{reservation.pickup_code}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {reservation.status === 'pending' && (
                      <>
                        <Button 
                          onClick={() => handleConfirm(reservation.id)}
                          className="bg-[#27AE60] hover:bg-[#229954]"
                        >
                          Confirmar
                        </Button>
                        <Button 
                          onClick={() => handleReject(reservation.id)}
                          variant="outline"
                          className="border-[#E84141] text-[#E84141]"
                        >
                          Recusar
                        </Button>
                      </>
                    )}
                    {reservation.status === 'confirmed' && (
                      <Button 
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setShowCodeModal(true);
                        }}
                        className="bg-[#1EC6C6] hover:bg-[#1AB5B5]"
                      >
                        Validar Retirada
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Code Validation Modal */}
        {showCodeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-[#0E1A2C] mb-4">Validar Código de Retirada</h3>
              <p className="text-gray-600 mb-4">Digite o código fornecido pelo mecânico:</p>
              <Input
                value={pickupCode}
                onChange={(e) => setPickupCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl mb-4"
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setShowCodeModal(false);
                  setPickupCode('');
                }} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handlePickup} className="flex-1 bg-[#1EC6C6] hover:bg-[#1AB5B5]">
                  Confirmar
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};