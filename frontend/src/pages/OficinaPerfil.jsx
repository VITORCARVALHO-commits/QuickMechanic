import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export const OficinaPerfil = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        description: user.description || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      toast({ title: "Perfil atualizado com sucesso" });
    } catch (error) {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#0E1A2C] mb-8">Perfil da Oficina</h1>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-[#1EC6C6]/10 rounded-full flex items-center justify-center">
                <Building2 className="h-10 w-10 text-[#1EC6C6]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0E1A2C]">{user?.name}</h2>
                <p className="text-gray-600">Oficina Parceira</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
                <Building2 className="h-4 w-4 inline mr-2" />
                Nome da Oficina
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Telefone
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
                <MapPin className="h-4 w-4 inline mr-2" />
                Endereço Completo
              </label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Cidade</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Estado</label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Descrição</label>
              <Textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Conte um pouco sobre sua oficina..."
              />
            </div>

            <Button type="submit" className="w-full bg-[#1EC6C6] hover:bg-[#1AB5B5]" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};