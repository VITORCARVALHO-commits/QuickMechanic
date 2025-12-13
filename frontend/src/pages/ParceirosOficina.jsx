import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { toast } from '../hooks/use-toast';
import { Building2, Package, TrendingUp, Shield, Check, Loader2 } from 'lucide-react';

export const ParceirosOficina = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    cnpj: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.shopName,
          email: formData.email,
          password: 'changeme123', // Temp password
          phone: formData.phone,
          user_type: 'shop',
          shop_info: {
            cnpj: formData.cnpj,
            owner_name: formData.ownerName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            description: formData.description
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Cadastro Enviado!",
          description: "Analisaremos e entraremos em contato em breve.",
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast({
          title: "Erro",
          description: result.message || "Erro ao cadastrar",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar cadastro",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1EC6C6] to-[#0E1A2C] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">Cadastre sua Oficina</h1>
              <p className="text-xl mb-8">
                Conecte-se a mecânicos e aumente suas vendas de peças. 
                Sem custo inicial, comissão apenas sobre vendas realizadas.
              </p>
              <Button 
                onClick={() => setShowForm(true)}
                size="lg"
                className="bg-white text-[#1EC6C6] hover:bg-gray-100 text-lg px-8 py-6"
              >
                Quero Ser Parceiro
              </Button>
            </div>
            <div>
              <Building2 className="h-64 w-64 mx-auto opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-[#0E1A2C] mb-12">
          Por Que Ser Parceiro?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <Package className="h-16 w-16 text-[#1EC6C6] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#0E1A2C] mb-3">Mais Vendas</h3>
            <p className="text-gray-600">
              Receba pré-reservas de mecânicos da sua região. 
              Aumente o giro de estoque.
            </p>
          </Card>
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <TrendingUp className="h-16 w-16 text-[#1EC6C6] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#0E1A2C] mb-3">Gestão Simples</h3>
            <p className="text-gray-600">
              Dashboard completo para gerenciar estoque e pré-reservas.
            </p>
          </Card>
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <Shield className="h-16 w-16 text-[#1EC6C6] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#0E1A2C] mb-3">Sem Risco</h3>
            <p className="text-gray-600">
              Sem mensalidade. Pague apenas comissão sobre vendas efetivadas.
            </p>
          </Card>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#0E1A2C] mb-12">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Cadastro', desc: 'Preencha o formulário com dados da oficina' },
              { num: '2', title: 'Aprovação', desc: 'Análise em até 48h' },
              { num: '3', title: 'Estoque', desc: 'Cadastre suas peças no sistema' },
              { num: '4', title: 'Vendas', desc: 'Receba pré-reservas e confirme disponibilidade' }
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-[#1EC6C6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">{step.num}</span>
                </div>
                <h3 className="font-bold text-[#0E1A2C] mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="max-w-2xl w-full p-8 my-8">
            <h2 className="text-3xl font-bold text-[#0E1A2C] mb-6">Cadastro de Oficina</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
                    Nome da Oficina *
                  </label>
                  <Input
                    value={formData.shopName}
                    onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
                    CNPJ *
                  </label>
                  <Input
                    value={formData.cnpj}
                    onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
                    Nome do Responsável *
                  </label>
                  <Input
                    value={formData.ownerName}
                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
                    Telefone *
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
                  Email *
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
                  Endereço Completo *
                </label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
                    Cidade *
                  </label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
                    Estado *
                  </label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">
                  Descrição (opcional)
                </label>
                <Textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Conte um pouco sobre sua oficina..."
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-[#1EC6C6] hover:bg-[#1AB5B5]"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar Cadastro'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
