import React from 'react';
import { Card } from '../components/ui/card';
import { Shield } from 'lucide-react';

export const Privacidade = () => {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="bg-gradient-to-r from-[#1EC6C6] to-[#0E1A2C] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="h-12 w-12" />
            <h1 className="text-5xl font-bold">Política de Privacidade</h1>
          </div>
          <p className="text-xl">Protegemos seus dados - LGPD Compliant</p>
          <p className="text-sm mt-2">Última atualização: Dezembro 2024</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <Card className="p-8 prose max-w-none">
          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">1. Dados Coletados</h2>
          <p className="text-gray-600 mb-6">
            Coletamos as seguintes informações:<br />
            • Nome, email, telefone<br />
            • Dados do veículo (placa, modelo, ano)<br />
            • Endereço para atendimento<br />
            • Histórico de serviços<br />
            • Dados de pagamento (processados por terceiros)
          </p>

          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">2. Como Usamos seus Dados</h2>
          <p className="text-gray-600 mb-6">
            Seus dados são utilizados para:<br />
            • Conectar você a mecânicos qualificados<br />
            • Processar pagamentos<br />
            • Enviar notificações sobre seus pedidos<br />
            • Melhorar nossos serviços<br />
            • Cumprir obrigações legais
          </p>

          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">3. Compartilhamento de Dados</h2>
          <p className="text-gray-600 mb-6">
            Compartilhamos dados apenas:<br />
            • Com mecânicos para prestação do serviço<br />
            • Com processadores de pagamento (Stripe)<br />
            • Quando exigido por lei<br />
            • Nunca vendemos seus dados a terceiros
          </p>

          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">4. Seus Direitos (LGPD)</h2>
          <p className="text-gray-600 mb-6">
            Você tem direito a:<br />
            • Acessar seus dados pessoais<br />
            • Corrigir dados incorretos<br />
            • Solicitar exclusão de dados<br />
            • Revogar consentimento<br />
            • Portabilidade de dados
          </p>

          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">5. Segurança</h2>
          <p className="text-gray-600 mb-6">
            Implementamos medidas técnicas e organizacionais para proteger seus dados:<br />
            • Criptografia de dados sensíveis<br />
            • Acesso restrito a dados pessoais<br />
            • Monitoramento de segurança 24/7<br />
            • Backups regulares
          </p>

          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">6. Cookies</h2>
          <p className="text-gray-600 mb-6">
            Usamos cookies para melhorar sua experiência. Você pode desabilitar cookies 
            nas configurações do navegador, mas isso pode afetar algumas funcionalidades.
          </p>

          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">7. Retenção de Dados</h2>
          <p className="text-gray-600 mb-6">
            Mantemos seus dados pelo tempo necessário para prestar o serviço ou conforme 
            exigido por lei (geralmente 5 anos para dados fiscais).
          </p>

          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">8. Contato - DPO</h2>
          <p className="text-gray-600">
            Para exercer seus direitos ou tirar dúvidas sobre privacidade:<br />
            Email: privacidade@clickmecanico.com<br />
            DPO (Encarregado de Dados): dpo@clickmecanico.com
          </p>
        </Card>
      </div>
    </div>
  );
};