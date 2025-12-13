import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Loader2, DollarSign, X } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export const SendQuoteModal = ({ order, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    labor_price: '',
    parts_price: '0',
    estimated_time: '',
    notes: '',
    warranty: '3 meses'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/mechanic/quotes/${order.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          labor_price: parseFloat(formData.labor_price),
          parts_price: parseFloat(formData.parts_price),
          estimated_time: formData.estimated_time,
          notes: formData.notes,
          warranty: formData.warranty
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "✅ Orçamento Enviado!",
          description: "Cliente foi notificado por email"
        });
        onSuccess();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = (parseFloat(formData.labor_price) || 0) + (parseFloat(formData.parts_price) || 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full p-6 bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#0E1A2C]">Enviar Orçamento</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Pedido #{order.id.slice(0,8)}</h3>
          <div className="text-sm space-y-1">
            <p><strong>Veículo:</strong> {order.make} {order.model} ({order.year})</p>
            <p><strong>Serviço:</strong> {order.service}</p>
            <p><strong>Local:</strong> {order.location}</p>
            <p><strong>Data:</strong> {order.date} às {order.time}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
              Mão de Obra (R$) *
            </label>
            <Input
              type="number"
              step="0.01"
              required
              placeholder="Ex: 150.00"
              value={formData.labor_price}
              onChange={(e) => setFormData({...formData, labor_price: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
              Peças (R$)
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="Ex: 50.00"
              value={formData.parts_price}
              onChange={(e) => setFormData({...formData, parts_price: e.target.value})}
            />
          </div>

          <div className="bg-[#F5F7FA] p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-2xl font-bold text-[#1EC6C6]">R$ {totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
              Tempo Estimado
            </label>
            <Input
              placeholder="Ex: 2h 30min"
              value={formData.estimated_time}
              onChange={(e) => setFormData({...formData, estimated_time: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
              Garantia
            </label>
            <Input
              placeholder="Ex: 3 meses"
              value={formData.warranty}
              onChange={(e) => setFormData({...formData, warranty: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
              Observações
            </label>
            <Textarea
              placeholder="Detalhes adicionais sobre o serviço..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.labor_price}
              className="flex-1 bg-[#27AE60] hover:bg-[#229954]"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Enviando...</>
              ) : (
                <><DollarSign className="h-5 w-5 mr-2" />Enviar Orçamento</>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
