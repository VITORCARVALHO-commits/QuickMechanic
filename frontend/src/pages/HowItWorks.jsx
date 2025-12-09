import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Search, Calendar, Wrench, CreditCard, Shield, Clock, Award, CheckCircle } from 'lucide-react';

export const HowItWorks = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const steps = [
    {
      icon: Search,
      number: '01',
      title: t('home.howItWorks.step1.title'),
      description: t('home.howItWorks.step1.desc'),
      details: 'Preencha um formulário rápido com informações sobre seu veículo e o serviço necessário. Nossa IA calcula o preço justo em segundos.',
      color: 'from-[#1EC6C6] to-[#1AB5B5]'
    },
    {
      icon: Calendar,
      number: '02',
      title: t('home.howItWorks.step2.title'),
      description: t('home.howItWorks.step2.desc'),
      details: 'Veja mecânicos disponíveis, compare avaliações e escolha a data e horário que melhor se encaixam na sua agenda.',
      color: 'from-[#FF9F1C] to-[#FF8C00]'
    },
    {
      icon: Wrench,
      number: '03',
      title: t('home.howItWorks.step3.title'),
      description: t('home.howItWorks.step3.desc'),
      details: 'O mecânico vai até o local escolhido com todas as ferramentas necessárias. Você pode acompanhar todo o processo.',
      color: 'from-[#27AE60] to-[#229954]'
    },
    {
      icon: CreditCard,
      number: '04',
      title: t('home.howItWorks.step4.title'),
      description: t('home.howItWorks.step4.desc'),
      details: 'Aprove o serviço e pague com segurança. Sem pagamento adiantado, só quando você estiver 100% satisfeito.',
      color: 'from-[#2D9CDB] to-[#1976D2]'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Garantia Total',
      description: '12 meses de garantia em serviços e peças. Sua segurança é nossa prioridade.'
    },
    {
      icon: Clock,
      title: 'Atendimento Rápido',
      description: 'Mecânicos disponíveis em até 24 horas. Flexibilidade de horários.'
    },
    {
      icon: Award,
      title: 'Profissionais Certificados',
      description: 'Todos os mecânicos são verificados, certificados e avaliados.'
    },
    {
      icon: CheckCircle,
      title: 'Preço Justo',
      description: 'Sem taxas ocultas. Você sabe exatamente quanto vai pagar.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#1EC6C6] to-[#1AB5B5] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">{t('home.howItWorks.title')}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Reparo automotivo nunca foi tão fácil. Conheça nosso processo simples em 4 etapas.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center gap-12`}>
                {/* Visual */}
                <div className="flex-1">
                  <div className={`relative w-full h-80 bg-gradient-to-br ${step.color} rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden group`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                    <step.icon className="h-40 w-40 text-white relative z-10 transform group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-8 right-8 text-white/20 text-9xl font-bold">
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="inline-block mb-4">
                    <span className={`bg-gradient-to-r ${step.color} text-white px-6 py-2 rounded-full text-lg font-bold`}>
                      Etapa {step.number}
                    </span>
                  </div>
                  <h2 className="text-4xl font-bold text-[#0E1A2C] mb-4">{step.title}</h2>
                  <p className="text-xl text-gray-600 mb-4">{step.description}</p>
                  <p className="text-gray-700 leading-relaxed">{step.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0E1A2C] mb-4">Por que escolher QuickMechanic?</h2>
            <p className="text-xl text-gray-600">Benefícios que fazem a diferença</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-b from-white to-[#F5F7FA] group">
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

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#1EC6C6] to-[#1AB5B5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Obtenha seu orçamento gratuito em menos de 2 minutos
          </p>
          <Button 
            size="lg" 
            className="bg-white text-[#1EC6C6] hover:bg-gray-100 px-12 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate('/')}
          >
            Obter Orçamento Grátis
          </Button>
        </div>
      </section>
    </div>
  );
};
