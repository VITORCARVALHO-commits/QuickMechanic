import React from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Check, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Precos = () => {
  const navigate = useNavigate();

  const services = [
    { name: 'Troca de Óleo', price: 'R$ 180', time: '30 min' },
    { name: 'Revisão Completa', price: 'R$ 450', time: '2-3 horas' },
    { name: 'Freios', price: 'R$ 320', time: '1-2 horas' },
    { name: 'Suspensão', price: 'R$ 580', time: '3-4 horas' },
    { name: 'Embreagem', price: 'R$ 1.500', time: '4-6 horas' },
    { name: 'Diagnóstico', price: 'R$ 150', time: '30-60 min' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1EC6C6] to-[#0E1A2C] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Preços Transparentes</h1>
          <p className="text-xl">Sem surpresas. Você sabe o valor antes de confirmar.</p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <Wrench className="h-8 w-8 text-[#1EC6C6]" />
                <span className="text-sm text-gray-500">{service.time}</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0E1A2C] mb-2">{service.name}</h3>
              <p className="text-3xl font-bold text-[#1EC6C6] mb-4">A partir de {service.price}</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-[#27AE60] mr-2" />
                  Mão de obra inclusa
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-[#27AE60] mr-2" />
                  Mecânico verificado
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-[#27AE60] mr-2" />
                  Peças à parte
                </li>
              </ul>
              <Button 
                onClick={() => navigate('/')} 
                className="w-full bg-[#1EC6C6] hover:bg-[#1AB5B5]"
              >
                Solicitar Serviço
              </Button>
            </Card>
          ))}
        </div>

        {/* Info */}
        <Card className="mt-12 p-8 bg-gradient-to-br from-[#1EC6C6]/10 to-white">
          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">Como Funciona a Cobrança?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-[#1EC6C6] mb-2">1. Depósito de R$ 50</h3>
              <p className="text-sm text-gray-600">Garante sua reserva. Será deduzido do valor final.</p>
            </div>
            <div>
              <h3 className="font-bold text-[#1EC6C6] mb-2">2. Orçamento Real</h3>
              <p className="text-sm text-gray-600">Mecânico analisa e envia cotação exata com mão de obra + peças.</p>
            </div>
            <div>
              <h3 className="font-bold text-[#1EC6C6] mb-2">3. Pagamento Final</h3>
              <p className="text-sm text-gray-600">Após aprovação, você paga o valor acordado menos os R$ 50 já pagos.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};