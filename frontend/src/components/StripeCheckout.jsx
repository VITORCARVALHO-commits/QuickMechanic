import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export const StripeCheckout = ({ orderId, amount, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');
      const origin = window.location.origin;

      const response = await fetch(`${API_URL}/api/stripe/checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: orderId,
          origin_url: origin
        })
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Erro",
        description: "Falha ao iniciar pagamento. Tente novamente.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#635BFF] rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#0E1A2C] mb-2">Pagamento Seguro</h2>
        <div className="text-3xl font-bold text-[#635BFF] mb-2">
          R$ {amount.toFixed(2).replace('.', ',')}
        </div>
        <p className="text-sm text-gray-600">Processado com Stripe</p>
      </div>

      {/* Payment Info */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">✓ Pagamento 100% Seguro</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Cartão de crédito ou débito</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Criptografia SSL de ponta a ponta</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Seus dados não são armazenados</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Confirmação instantânea</span>
          </li>
        </ul>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full h-12 bg-[#635BFF] hover:bg-[#5048E5] text-white text-lg font-semibold"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Redirecionando...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Pagar com Stripe
          </>
        )}
      </Button>

      <Button
        onClick={onCancel}
        variant="outline"
        className="w-full mt-3"
        disabled={loading}
      >
        Cancelar
      </Button>

      <p className="text-xs text-center text-gray-500 mt-4">
        Ao clicar em "Pagar com Stripe", você será redirecionado para uma página segura de pagamento.
      </p>
    </Card>
  );
};
