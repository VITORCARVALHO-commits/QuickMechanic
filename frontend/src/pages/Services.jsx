import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Wrench, Battery, Wind, Gauge, AlertCircle, 
  Cog, Zap, Droplet, Settings, Shield 
} from 'lucide-react';

export const Services = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const services = [
    {
      id: 'oil_change',
      icon: Droplet,
      name: { pt: 'Troca de Óleo', en: 'Oil Change' },
      description: { 
        pt: 'Troca de óleo do motor com filtro. Inclui verificação de níveis.',
        en: 'Engine oil change with filter. Includes level check.'
      },
      price: 'R$ 150',
      duration: '30 min',
      popular: true
    },
    {
      id: 'brakes',
      icon: AlertCircle,
      name: { pt: 'Sistema de Freios', en: 'Brake System' },
      description: { 
        pt: 'Inspeção, ajuste ou troca de pastilhas e discos de freio.',
        en: 'Inspection, adjustment or replacement of brake pads and discs.'
      },
      price: 'R$ 300',
      duration: '1-2 horas',
      popular: true
    },
    {
      id: 'suspension',
      icon: Settings,
      name: { pt: 'Suspensão', en: 'Suspension' },
      description: { 
        pt: 'Reparo e substituição de componentes da suspensão.',
        en: 'Repair and replacement of suspension components.'
      },
      price: 'R$ 450',
      duration: '2-3 horas',
      popular: false
    },
    {
      id: 'diagnostic',
      icon: Gauge,
      name: { pt: 'Diagnóstico Completo', en: 'Full Diagnostic' },
      description: { 
        pt: 'Diagnóstico eletrônico completo com scanner automotivo.',
        en: 'Complete electronic diagnostic with automotive scanner.'
      },
      price: 'R$ 200',
      duration: '1 hora',
      popular: true
    },
    {
      id: 'maintenance',
      icon: Wrench,
      name: { pt: 'Revisão Preventiva', en: 'Preventive Maintenance' },
      description: { 
        pt: 'Revisão completa com verificação de todos os sistemas.',
        en: 'Complete inspection with all systems check.'
      },
      price: 'R$ 350',
      duration: '2 horas',
      popular: true
    },
    {
      id: 'battery',
      icon: Battery,
      name: { pt: 'Bateria', en: 'Battery' },
      description: { 
        pt: 'Teste, recarga ou substituição de bateria.',
        en: 'Test, recharge or battery replacement.'
      },
      price: 'R$ 250',
      duration: '30 min',
      popular: false
    },
    {
      id: 'air_conditioning',
      icon: Wind,
      name: { pt: 'Ar Condicionado', en: 'Air Conditioning' },
      description: { 
        pt: 'Manutenção, recarga de gás e reparo do sistema.',
        en: 'Maintenance, gas recharge and system repair.'
      },
      price: 'R$ 280',
      duration: '1-2 horas',
      popular: false
    },
    {
      id: 'transmission',
      icon: Cog,
      name: { pt: 'Transmissão', en: 'Transmission' },
      description: { 
        pt: 'Reparo e manutenção de transmissão manual ou automática.',
        en: 'Repair and maintenance of manual or automatic transmission.'
      },
      price: 'R$ 800',
      duration: '3-4 horas',
      popular: false
    },
    {
      id: 'electrical',
      icon: Zap,
      name: { pt: 'Elétrica', en: 'Electrical' },
      description: { 
        pt: 'Diagnóstico e reparo de sistema elétrico.',
        en: 'Electrical system diagnosis and repair.'
      },
      price: 'R$ 350',
      duration: '1-3 horas',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#1EC6C6] to-[#1AB5B5] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">{t('services.title')}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Serviços completos para seu veículo com garantia de 12 meses
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className="p-6 hover:shadow-2xl transition-all duration-300 border-0 bg-white group cursor-pointer"
                onClick={() => navigate('/', { state: { preselectedService: service.id } })}
              >
                <div className="relative">
                  {service.popular && (
                    <Badge className="absolute -top-3 -right-3 bg-[#FF9F1C] text-white border-0">
                      Popular
                    </Badge>
                  )}
                  
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1EC6C6] to-[#1AB5B5] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-[#0E1A2C] mb-2">
                    {service.name[language]}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 min-h-[48px]">
                    {service.description[language]}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-500">A partir de</div>
                      <div className="text-2xl font-bold text-[#1EC6C6]">{service.price}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Duração</div>
                      <div className="font-semibold text-[#0E1A2C]">{service.duration}</div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-[#1EC6C6] hover:bg-[#1AB5B5] text-white group-hover:shadow-lg transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/', { state: { preselectedService: service.id } });
                    }}
                  >
                    Solicitar Orçamento
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 bg-gradient-to-br from-[#27AE60]/10 to-white border-2 border-[#27AE60]/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-[#27AE60] rounded-full flex items-center justify-center">
                  <Shield className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-3xl font-bold text-[#0E1A2C] mb-3">Garantia de 12 Meses</h2>
                <p className="text-xl text-gray-600">
                  Todos os nossos serviços incluem garantia de 12 meses para peças e mão de obra. 
                  Sua tranquilidade é nossa prioridade.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#1EC6C6] to-[#1AB5B5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Não encontrou o que precisa?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Entre em contato conosco para orçamentos personalizados
          </p>
          <Button 
            size="lg" 
            className="bg-white text-[#1EC6C6] hover:bg-gray-100 px-12 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate('/')}
          >
            Obter Orçamento
          </Button>
        </div>
      </section>
    </div>
  );
};
