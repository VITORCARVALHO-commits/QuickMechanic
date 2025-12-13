import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { EnhancedCard } from '../components/ui/enhanced-card';
import { StatCard } from '../components/ui/stat-card';
import { SkeletonList } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, Wrench, DollarSign, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar estatísticas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0E1A2C]">Admin Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clientes</p>
                <p className="text-3xl font-bold text-[#1EC6C6]">{stats?.total_clients || 0}</p>
              </div>
              <Users className="h-12 w-12 text-[#1EC6C6]" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mecânicos Ativos</p>
                <p className="text-3xl font-bold text-[#27AE60]">{stats?.active_mechanics || 0}</p>
              </div>
              <Wrench className="h-12 w-12 text-[#27AE60]" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pedidos Hoje</p>
                <p className="text-3xl font-bold text-[#F39C12]">{stats?.orders_today || 0}</p>
              </div>
              <ShoppingCart className="h-12 w-12 text-[#F39C12]" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Mês</p>
                <p className="text-2xl font-bold text-green-600">R$ {stats?.revenue_month?.toFixed(2) || '0.00'}</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/mechanics')}>
            <Wrench className="h-10 w-10 text-[#1EC6C6] mb-4" />
            <h3 className="font-bold text-lg mb-2">Aprovar Mecânicos</h3>
            <p className="text-sm text-gray-600">{stats?.pending_mechanics || 0} pendentes</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/orders')}>
            <ShoppingCart className="h-10 w-10 text-[#F39C12] mb-4" />
            <h3 className="font-bold text-lg mb-2">Gerenciar Pedidos</h3>
            <p className="text-sm text-gray-600">{stats?.active_orders || 0} ativos</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/disputes')}>
            <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Disputas</h3>
            <p className="text-sm text-gray-600">{stats?.open_disputes || 0} abertas</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {stats?.recent_activity?.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <div className="w-2 h-2 bg-[#1EC6C6] rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{activity.title}</p>
                  <p className="text-xs text-gray-600">{activity.time}</p>
                </div>
              </div>
            )) || <p className="text-gray-500 text-center py-4">Nenhuma atividade recente</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};
