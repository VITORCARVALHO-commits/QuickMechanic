import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { AlertTriangle, CheckCircle, X, Loader2 } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export const AdminDisputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/admin/disputes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setDisputes(data.data);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar disputas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resolveDispute = async (disputeId, decision) => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/admin/disputes/${disputeId}/resolve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          decision: decision,
          resolution_notes: resolution
        })
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "✅ Disputa Resolvida!",
          description: "Partes foram notificadas"
        });
        setSelectedDispute(null);
        setResolution('');
        loadDisputes();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0E1A2C]">Disputas</h1>
          <p className="text-gray-600">Resolver conflitos entre clientes e mecânicos</p>
        </div>

        <div className="space-y-4">
          {disputes.map((dispute) => (
            <Card key={dispute.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <h3 className="font-bold text-lg">Disputa #{dispute.id.slice(0, 8)}</h3>
                  </div>
                  <Badge className={dispute.status === 'open' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                    {dispute.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(dispute.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold mb-1">Pedido: #{dispute.order_id?.slice(0, 8)}</p>
                <p className="text-sm text-gray-700 mb-2"><strong>Reclamação:</strong> {dispute.complaint}</p>
                <p className="text-sm text-gray-600"><strong>Tipo:</strong> {dispute.dispute_type}</p>
              </div>

              {dispute.status === 'open' && (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Notas da resolução..."
                    value={selectedDispute === dispute.id ? resolution : ''}
                    onChange={(e) => {
                      setSelectedDispute(dispute.id);
                      setResolution(e.target.value);
                    }}
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={() => resolveDispute(dispute.id, 'favor_client')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      A Favor do Cliente
                    </Button>
                    <Button
                      onClick={() => resolveDispute(dispute.id, 'favor_mechanic')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      A Favor do Mecânico
                    </Button>
                    <Button
                      onClick={() => resolveDispute(dispute.id, 'partial')}
                      variant="outline"
                      className="flex-1"
                    >
                      Acordo Parcial
                    </Button>
                  </div>
                </div>
              )}

              {dispute.status === 'resolved' && dispute.resolution_notes && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                  <p className="text-sm font-semibold text-green-800 mb-1">Resolução:</p>
                  <p className="text-sm text-green-700">{dispute.resolution_notes}</p>
                  <p className="text-xs text-green-600 mt-1">Decisão: {dispute.decision}</p>
                </div>
              )}
            </Card>
          ))}

          {disputes.length === 0 && (
            <Card className="p-12 text-center">
              <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma disputa aberta</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
