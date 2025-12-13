import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from '../hooks/use-toast';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

export const OficinaEstoque = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    part_id: '',
    part_name: '',
    part_code: '',
    quantity: 0,
    price: 0,
    location: ''
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/shop/inventory`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      if (editingItem) {
        // Update
        const response = await fetch(`${API_URL}/api/shop/inventory/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          toast({ title: "Peça atualizada com sucesso" });
        }
      } else {
        // Create
        const response = await fetch(`${API_URL}/api/shop/inventory`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            part_id: formData.part_id || `part_${Date.now()}`
          })
        });

        if (response.ok) {
          toast({ title: "Peça adicionada com sucesso" });
        }
      }

      setShowModal(false);
      setEditingItem(null);
      setFormData({ part_id: '', part_name: '', part_code: '', quantity: 0, price: 0, location: '' });
      loadInventory();
    } catch (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Confirmar exclusão?')) return;

    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/shop/inventory/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast({ title: "Peça removida" });
        loadInventory();
      }
    } catch (error) {
      toast({ title: "Erro ao deletar", variant: "destructive" });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      part_id: item.part_id,
      part_name: item.part_name,
      part_code: item.part_code,
      quantity: item.quantity,
      price: item.price,
      location: item.location || ''
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#0E1A2C]">Estoque de Peças</h1>
          <Button 
            onClick={() => {
              setEditingItem(null);
              setFormData({ part_id: '', part_name: '', part_code: '', quantity: 0, price: 0, location: '' });
              setShowModal(true);
            }}
            className="bg-[#1EC6C6] hover:bg-[#1AB5B5]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Peça
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Carregando...</div>
        ) : items.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma peça cadastrada</p>
            <Button onClick={() => setShowModal(true)} className="mt-4">
              Adicionar Primeira Peça
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {items.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Package className="h-8 w-8 text-[#1EC6C6]" />
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="text-[#1EC6C6] hover:text-[#1AB5B5]">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-[#E84141] hover:text-[#C73535]">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-[#0E1A2C] mb-1">{item.part_name}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.part_code}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Quantidade:</span>
                    <span className="font-semibold">{item.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Preço:</span>
                    <span className="font-semibold">R$ {item.price.toFixed(2)}</span>
                  </div>
                  {item.location && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Local:</span>
                      <span className="font-semibold">{item.location}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-[#0E1A2C] mb-6">
                {editingItem ? 'Editar Peça' : 'Adicionar Peça'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Nome da Peça *</label>
                  <Input
                    value={formData.part_name}
                    onChange={(e) => setFormData({...formData, part_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Código</label>
                  <Input
                    value={formData.part_code}
                    onChange={(e) => setFormData({...formData, part_code: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Quantidade *</label>
                    <Input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Preço (R$) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Localização (Prateleira)</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Ex: A1, Prateleira 3"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                  }} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 bg-[#1EC6C6] hover:bg-[#1AB5B5]">
                    {editingItem ? 'Atualizar' : 'Adicionar'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};