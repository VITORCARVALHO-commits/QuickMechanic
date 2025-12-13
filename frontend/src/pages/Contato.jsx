import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Contato = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate send
    setTimeout(() => {
      toast({
        title: "Mensagem Enviada!",
        description: "Entraremos em contato em breve.",
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="bg-gradient-to-r from-[#1EC6C6] to-[#0E1A2C] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Fale Conosco</h1>
          <p className="text-xl">Estamos aqui para ajudar você.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-[#0E1A2C] mb-6">Envie sua Mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Nome</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Telefone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#0E1A2C] mb-2 block">Mensagem</label>
                <Textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#1EC6C6] hover:bg-[#1AB5B5]" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Mensagem'}
              </Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <Mail className="h-8 w-8 text-[#1EC6C6] mb-4" />
              <h3 className="font-bold text-[#0E1A2C] mb-2">Email</h3>
              <p className="text-gray-600">contato@clickmecanico.com</p>
            </Card>
            <Card className="p-6">
              <Phone className="h-8 w-8 text-[#1EC6C6] mb-4" />
              <h3 className="font-bold text-[#0E1A2C] mb-2">Telefone</h3>
              <p className="text-gray-600">0800 123 4567</p>
            </Card>
            <Card className="p-6">
              <MapPin className="h-8 w-8 text-[#1EC6C6] mb-4" />
              <h3 className="font-bold text-[#0E1A2C] mb-2">Endereço</h3>
              <p className="text-gray-600">São Paulo, Brasil</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};