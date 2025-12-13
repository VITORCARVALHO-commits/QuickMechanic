import React from 'react';
import { Card } from '../components/ui/card';

export const Termos = () => {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="bg-gradient-to-r from-[#1EC6C6] to-[#0E1A2C] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Termos de Uso</h1>
          <p className="text-xl">Última atualização: Dezembro 2024</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <Card className="p-8 prose max-w-none">
          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">1. Aceitação dos Termos</h2>
          <p className="text-gray-600 mb-6">
            Ao acessar e usar o ClickMecanico, você concorda com estes termos de uso. 
            Se não concordar, não utilize nossos serviços.
          </p>

          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">2. Descrição do Serviço</h2>
          <p className="text-gray-600 mb-6">
            O ClickMecanico é uma plataforma que conecta clientes a mecânicos e oficinas 
            verificados. Facilitamos o agendamento de serviços automotivos, mas não prestamos 
            os serviços diretamente.
          </p>

          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">3. Cadastro e Conta</h2>
          <p className="text-gray-600 mb-6">
            • Você deve fornecer informações verdadeiras e atualizadas.<br />
            • É sua responsabilidade manter a senha segura.<br />
            • Não compartilhe sua conta com terceiros.
          </p>

          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">4. Depósito e Pagamentos</h2>
          <p className="text-gray-600 mb-6">
            • O depósito de R$ 50 garante sua reserva.<br />
            • O valor é deduzido do pagamento final.<br />
            • Reembolsos seguem nossa política de cancelamento.
          </p>

          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">5. Responsabilidades</h2>
          <p className="text-gray-600 mb-6">
            • O ClickMecanico não é responsável pela qualidade dos serviços prestados pelos mecânicos.<br />
            • Atuamos como intermediário entre clientes e prestadores.<br />
            • Problemas com o serviço devem ser resolvidos diretamente com o mecânico.
          </p>

          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">6. Proibições</h2>
          <p className="text-gray-600 mb-6">
            É proibido:<br />
            • Usar a plataforma para fins ilegais<br />
            • Tentar burlar o sistema de pagamento<br />
            • Fazer reservas falsas<br />
            • Assediar outros usuários
          </p>

          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">7. Modificações</h2>
          <p className="text-gray-600 mb-6">
            Reservamos o direito de modificar estes termos a qualquer momento. 
            Mudanças significativas serão notificadas por email.
          </p>

          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-4">8. Contato</h2>
          <p className="text-gray-600">
            Dúvidas sobre os termos? Entre em contato: contato@clickmecanico.com
          </p>
        </Card>
      </div>
    </div>
  );
};