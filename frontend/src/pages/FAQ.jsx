import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { ChevronDown } from 'lucide-react';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Como funciona o ClickMecanico?',
      answer: 'Você busca seu veículo pela placa, seleciona o serviço desejado, paga R$ 50 de depósito e recebe cotações de mecânicos verificados. Escolhe o melhor, agenda e pronto!'
    },
    {
      question: 'O depósito de R$ 50 é reembolsável?',
      answer: 'Sim! O valor de R$ 50 é deduzido do preço final do serviço. Ou seja, você não paga a mais.'
    },
    {
      question: 'Posso cancelar depois de pagar o depósito?',
      answer: 'Sim. Se cancelar antes do mecânico aceitar, o depósito é reembolsado em até 7 dias úteis.'
    },
    {
      question: 'Como sei se o mecânico é confiável?',
      answer: 'Todos os mecânicos passam por verificação de documentos e avaliação. Você também pode ver as avaliações de outros clientes.'
    },
    {
      question: 'O mecânico vai até minha casa?',
      answer: 'Sim! A maioria dos mecânicos oferece atendimento móvel. Você escolhe se prefere atendimento em casa, trabalho ou na oficina.'
    },
    {
      question: 'E se eu precisar de peças?',
      answer: 'O mecânico faz o diagnóstico e inclui o valor das peças no orçamento. Você aprova antes de iniciar o serviço.'
    },
    {
      question: 'Como funciona o pagamento final?',
      answer: 'Após o serviço, você paga o valor acordado menos os R$ 50 já pagos. Pode pagar em dinheiro, PIX ou cartão diretamente ao mecânico.'
    },
    {
      question: 'Posso pedir mais de um orçamento?',
      answer: 'Sim! Você receberá cotações de vários mecânicos disponíveis e escolhe o que preferir.'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="bg-gradient-to-r from-[#1EC6C6] to-[#0E1A2C] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Perguntas Frequentes</h1>
          <p className="text-xl">Encontre respostas rápidas para suas dúvidas.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Card key={idx} className="overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-[#0E1A2C] pr-4">{faq.question}</h3>
                <ChevronDown 
                  className={`h-5 w-5 text-[#1EC6C6] transition-transform ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-6 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};