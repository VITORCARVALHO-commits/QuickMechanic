import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';
import { CheckCircle, X, Loader2, User } from 'lucide-react';

export const AdminMechanicsApproval = () => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingMechanics();
  }, []);

  const loadPendingMechanics = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/admin/mechanics/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setMechanics(data.data);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar mecânicos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (mechanicId) => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/admin/mechanics/${mechanicId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "✅ Mecânico Aprovado!",
          description: "O mecânico foi notificado"
        });
        loadPendingMechanics();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleReject = async (mechanicId) => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/admin/mechanics/${mechanicId}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Mecânico Rejeitado",
          description: "O cadastro foi recusado"
        });
        loadPendingMechanics();
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
          <h1 className="text-3xl font-bold text-[#0E1A2C]">Aprovar Mecânicos</h1>
          <p className="text-gray-600">Mecânicos aguardando aprovação</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {mechanics.map((mechanic) => (
            <Card key={mechanic.id} className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#0E1A2C]">{mechanic.name}</h3>
                  <p className="text-sm text-gray-600">{mechanic.email}</p>
                  <Badge className="bg-yellow-100 text-yellow-800 mt-1">
                    {mechanic.approval_status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <p><strong>Telefone:</strong> {mechanic.phone || 'N/A'}</p>
                <p><strong>Localização:</strong> {mechanic.location || 'N/A'}</p>
                <p><strong>Experiência:</strong> {mechanic.years_experience || 'N/A'} anos</p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleReject(mechanic.id)}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="h-5 w-5 mr-2" />
                  Rejeitar
                </Button>
                <Button
                  onClick={() => handleApprove(mechanic.id)}
                  className="flex-1 bg-[#27AE60] hover:bg-[#229954]"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Aprovar
                </Button>
              </div>
            </Card>
          ))}

          {mechanics.length === 0 && (
            <Card className="p-12 text-center col-span-2">
              <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum mecânico aguardando aprovação</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
