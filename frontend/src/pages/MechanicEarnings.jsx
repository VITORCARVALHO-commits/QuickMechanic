import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { DollarSign, TrendingUp, Loader2 } from 'lucide-react';

export const MechanicEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/mechanic/earnings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setEarnings(data.data);
      }
    } catch (error) {
      console.error('Error loading earnings:', error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-3xl font-bold text-[#0E1A2C] mb-8">Meus Ganhos</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bruto</p>
                <p className="text-2xl font-bold text-[#1EC6C6]">
                  R$ {earnings?.total_earnings?.toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-[#1EC6C6]" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa Plataforma (15%)</p>
                <p className="text-2xl font-bold text-orange-500">
                  - R$ {earnings?.platform_fee?.toFixed(2) || '0.00'}
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-orange-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ganho Líquido</p>
                <p className="text-2xl font-bold text-[#27AE60]">
                  R$ {earnings?.net_earnings?.toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-[#27AE60]" />
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Últimos Serviços Concluídos</h3>
          <div className="space-y-3">
            {earnings?.orders?.map((order) => (
              <div key={order.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">#{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-600">{order.service}</p>
                  <p className="text-xs text-gray-500">{new Date(order.completed_at).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#27AE60]">R$ {order.final_price?.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    Líquido: R$ {(order.final_price * 0.85).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
