import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from '../hooks/use-toast';
import { 
  Wrench, DollarSign, Calendar, Shield, TrendingUp, 
  Users, Award, CheckCircle 
} from 'lucide-react';

export const BecomeMechanic = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    experience: '',
    specialties: [],
    hasWorkshop: false,
    mobileService: false,
    certifications: '',
    about: ''
  });

  const specialtyOptions = [
    'Troca de Óleo',
    'Freios',
    'Suspensão',
    'Diagnóstico',
    'Motor',
    'Transmissão',
    'Elétrica',
    'Ar Condicionado'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    toast({
      title: "✅ Inscrição Recebida!",
      description: "Entraremos em contato em até 48 horas para prosseguir com seu cadastro."
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      experience: '',
      specialties: [],
      hasWorkshop: false,
      mobileService: false,
      certifications: '',
      about: ''
    });
  };

  const handleSpecialtyToggle = (specialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const benefits = [
    {
      icon: DollarSign,
      title: 'Ganhos Flexíveis',
      description: 'Defina seus próprios horários e aumente seus ganhos em até 40%'
    },
    {
      icon: Users,
      title: 'Clientes Garantidos',
      description: 'Acesso a milhares de clientes procurando serviços automotivos'
    },
    {
      icon: Calendar,
      title: 'Gestão Simplificada',
      description: 'Plataforma completa para gerenciar agendamentos e pagamentos'
    },
    {
      icon: Shield,
      title: 'Segurança Garantida',
      description: 'Pagamentos seguros e garantia de recebimento pelos serviços'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#1EC6C6] to-[#1AB5B5] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">{t('nav.becomeMechanic')}</h1>
              <p className="text-xl text-white/90 mb-8">
                Junte-se à maior plataforma de serviços automotivos do Brasil e expanda seu negócio
              </p>
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-4xl font-bold">500+</div>
                  <div className="text-white/90">Mecânicos Ativos</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">R$ 8k</div>
                  <div className="text-white/90">Média Mensal</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">4.9</div>
                  <div className="text-white/90">Avaliação</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600" 
                alt="Mechanic" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0E1A2C] mb-4">Por que se juntar a nós?</h2>
            <p className="text-xl text-gray-600">Benefícios exclusivos para nossos parceiros</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-all duration-300 border-0 group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1EC6C6] to-[#1AB5B5] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#0E1A2C] mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0E1A2C] mb-4">Requisitos</h2>
            <p className="text-xl text-gray-600">O que você precisa para se cadastrar</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Experiência comprovada em serviços automotivos',
              'Certificações profissionais (diferenciais)',
              'Ferramentas próprias para atendimento',
              'Disposição para atendimento móvel ou oficina',
              'Documentos pessoais e profissionais',
              'Referências ou portfólio de trabalhos'
            ].map((req, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-[#F5F7FA] rounded-lg">
                <CheckCircle className="h-6 w-6 text-[#27AE60] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-[#0E1A2C] mb-4">Cadastre-se Agora</h2>
              <p className="text-xl text-gray-600">Preencha o formulário e começe sua jornada</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0E1A2C]">Nome Completo *</label>
                  <Input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Seu nome completo"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0E1A2C]">Email *</label>
                  <Input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="seu@email.com"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0E1A2C]">Telefone *</label>
                  <Input 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0E1A2C]">Cidade *</label>
                  <Input 
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="São Paulo, SP"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0E1A2C]">Anos de Experiência *</label>
                <Input 
                  required
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  placeholder="Ex: 5"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0E1A2C]">Especialidades *</label>
                <div className="grid md:grid-cols-4 gap-3">
                  {specialtyOptions.map(specialty => (
                    <div key={specialty} className="flex items-center gap-2">
                      <Checkbox 
                        checked={formData.specialties.includes(specialty)}
                        onCheckedChange={() => handleSpecialtyToggle(specialty)}
                      />
                      <label className="text-sm text-gray-700">{specialty}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-4 border-2 rounded-lg">
                  <Checkbox 
                    checked={formData.mobileService}
                    onCheckedChange={(checked) => setFormData({...formData, mobileService: checked})}
                  />
                  <label className="text-sm font-medium text-[#0E1A2C]">
                    Ofereço atendimento móvel
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 border-2 rounded-lg">
                  <Checkbox 
                    checked={formData.hasWorkshop}
                    onCheckedChange={(checked) => setFormData({...formData, hasWorkshop: checked})}
                  />
                  <label className="text-sm font-medium text-[#0E1A2C]">
                    Possuo oficina
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0E1A2C]">Certificações</label>
                <Input 
                  value={formData.certifications}
                  onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                  placeholder="Ex: ASE Certified, Bosch Trained"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0E1A2C]">Sobre Você *</label>
                <Textarea 
                  required
                  value={formData.about}
                  onChange={(e) => setFormData({...formData, about: e.target.value})}
                  placeholder="Conte-nos sobre sua experiência e especialidades..."
                  className="min-h-[120px]"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-[#1EC6C6] to-[#1AB5B5] hover:from-[#1AB5B5] hover:to-[#1EC6C6] text-white text-lg font-semibold shadow-lg"
              >
                Enviar Inscrição
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
};
