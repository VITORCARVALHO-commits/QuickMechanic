import React from 'react';
import { Card } from '../components/ui/card';
import { AlertCircle, Check, X } from 'lucide-react';

export const Cancelamento = () => {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="bg-gradient-to-r from-[#1EC6C6] to-[#0E1A2C] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Política de Cancelamento e Reembolso</h1>
          <p className="text-xl">Transparência total sobre cancelamentos e devoluções</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        {/* Quando pode cancelar */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Check className="h-8 w-8 text-[#27AE60]" />
            <h2 className="text-2xl font-bold text-[#0E1A2C]">Cancelamento com Reembolso Total</h2>
          </div>
          <div className="space-y-3 text-gray-600">
            <p className="flex items-start gap-2">
              <Check className="h-5 w-5 text-[#27AE60] mt-0.5 flex-shrink-0" />
              <span>Antes do mecânico aceitar o pedido: <strong>Reembolso de 100%</strong> em até 7 dias úteis</span>
            </p>
            <p className="flex items-start gap-2">
              <Check className="h-5 w-5 text-[#27AE60] mt-0.5 flex-shrink-0" />
              <span>Se o mecânico cancelar: <strong>Reembolso de 100%</strong> imediato</span>
            </p>
            <p className="flex items-start gap-2">
              <Check className="h-5 w-5 text-[#27AE60] mt-0.5 flex-shrink-0" />
              <span>Com mais de 24h de antecedência do agendamento: <strong>Reembolso de 100%</strong></span>
            </p>
          </div>
        </Card>

        {/* Quando NÃO pode cancelar */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <X className="h-8 w-8 text-[#E84141]" />
            <h2 className="text-2xl font-bold text-[#0E1A2C]">Cancelamento com Reembolso Parcial</h2>
          </div>
          <div className="space-y-3 text-gray-600">
            <p className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-[#F39C12] mt-0.5 flex-shrink-0" />
              <span>Entre 12-24h antes do agendamento: <strong>Reembolso de 50%</strong></span>
            </p>
            <p className="flex items-start gap-2">
              <X className="h-5 w-5 text-[#E84141] mt-0.5 flex-shrink-0" />
              <span>Menos de 12h antes: <strong>Sem reembolso</strong> (taxa de no-show)</span>
            </p>
            <p className="flex items-start gap-2">
              <X className="h-5 w-5 text-[#E84141] mt-0.5 flex-shrink-0" />
              <span>Após mecânico iniciar o serviço: <strong>Sem reembolso</strong></span>
            </p>
          </div>
        </Card>

        {/* Como cancelar */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-6">Como Solicitar Cancelamento</h2>
          <ol className="space-y-3 text-gray-600 list-decimal list-inside">
            <li>Acesse seu dashboard</li>
            <li>Clique no pedido que deseja cancelar</li>
            <li>Clique em "Cancelar Pedido"</li>
            <li>Selecione o motivo do cancelamento</li>
            <li>Confirme o cancelamento</li>
          </ol>
          <p className="mt-4 text-sm text-gray-500">
            O reembolso será processado automaticamente para o mesmo método de pagamento usado na compra.
          </p>
        </Card>

        {/* Problemas com o serviço */}
        <Card className="p-8 bg-gradient-to-br from-[#F39C12]/10 to-white border-[#F39C12]/20">
          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">Problemas com o Serviço?</h2>
          <p className="text-gray-600 mb-4">
            Se houve algum problema com a qualidade do serviço prestado, você pode:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-[#1EC6C6] mt-0.5 flex-shrink-0" />
              <span>Abrir uma disputa em até 48h após conclusão</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-[#1EC6C6] mt-0.5 flex-shrink-0" />
              <span>Nossa equipe analisará o caso</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-[#1EC6C6] mt-0.5 flex-shrink-0" />
              <span>Possível reembolso total ou parcial conforme análise</span>
            </li>
          </ul>
        </Card>

        {/* Contato */}
        <Card className="p-8 text-center">
          <h3 className="font-bold text-[#0E1A2C] mb-2">Dúvidas sobre Cancelamento?</h3>
          <p className="text-gray-600 mb-4">Nossa equipe está pronta para ajudar</p>
          <p className="text-[#1EC6C6] font-bold">contato@clickmecanico.com</p>
        </Card>
      </div>
    </div>
  );
};