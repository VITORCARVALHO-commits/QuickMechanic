import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OficinaDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    inventoryItems: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const [reservationsRes, inventoryRes] = await Promise.all([
        fetch(`${API_URL}/api/reservations/my-reservations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/shop/inventory`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const reservations = await reservationsRes.json();
      const inventory = await inventoryRes.json();

      if (reservations.success && inventory.success) {
        const pending = reservations.reservations.filter(r => r.status === 'pending').length;
        const confirmed = reservations.reservations.filter(r => r.status === 'confirmed').length;
        const revenue = reservations.reservations
          .filter(r => r.status === 'picked_up')
          .reduce((sum, r) => sum + r.price * r.quantity, 0);

        setStats({
          totalReservations: reservations.reservations.length,
          pendingReservations: pending,
          confirmedReservations: confirmed,
          inventoryItems: inventory.items.length,
          totalRevenue: revenue
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#0E1A2C] mb-8">Dashboard da Oficina</h1>
        <p className="text-gray-600 mb-8">Bem-vindo, {user?.name}</p>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <Clock className="h-8 w-8 text-[#F39C12] mb-2" />
            <p className="text-sm text-gray-600">Pendentes</p>
            <p className="text-3xl font-bold text-[#0E1A2C]">{stats.pendingReservations}</p>
          </Card>
          <Card className="p-6">
            <CheckCircle className="h-8 w-8 text-[#27AE60] mb-2" />
            <p className="text-sm text-gray-600">Confirmadas</p>
            <p className="text-3xl font-bold text-[#0E1A2C]">{stats.confirmedReservations}</p>
          </Card>
          <Card className="p-6">
            <Package className="h-8 w-8 text-[#1EC6C6] mb-2" />
            <p className="text-sm text-gray-600">Itens em Estoque</p>
            <p className="text-3xl font-bold text-[#0E1A2C]">{stats.inventoryItems}</p>
          </Card>
          <Card className="p-6">
            <TrendingUp className="h-8 w-8 text-[#27AE60] mb-2" />
            <p className="text-sm text-gray-600">Receita Total</p>
            <p className="text-3xl font-bold text-[#0E1A2C]">R$ {stats.totalRevenue.toFixed(2)}</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card 
            className="p-8 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/oficina/pre-reservas')}
          >
            <Clock className="h-12 w-12 text-[#1EC6C6] mb-4" />
            <h3 className="text-xl font-bold text-[#0E1A2C] mb-2">Pré-Reservas</h3>
            <p className="text-gray-600">Gerenciar solicitações de mecânicos</p>
            {stats.pendingReservations > 0 && (
              <span className="inline-block mt-4 px-3 py-1 bg-[#F39C12] text-white rounded-full text-sm">
                {stats.pendingReservations} pendente{stats.pendingReservations > 1 ? 's' : ''}
              </span>
            )}
          </Card>
          <Card 
            className="p-8 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/oficina/estoque')}
          >
            <Package className="h-12 w-12 text-[#1EC6C6] mb-4" />
            <h3 className="text-xl font-bold text-[#0E1A2C] mb-2">Estoque</h3>
            <p className="text-gray-600">Adicionar e gerenciar peças</p>
          </Card>
          <Card 
            className="p-8 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/oficina/perfil')}
          >
            <TrendingUp className="h-12 w-12 text-[#1EC6C6] mb-4" />
            <h3 className="text-xl font-bold text-[#0E1A2C] mb-2">Perfil</h3>
            <p className="text-gray-600">Dados e configurações</p>
          </Card>
        </div>
      </div>
    </div>
  );
};