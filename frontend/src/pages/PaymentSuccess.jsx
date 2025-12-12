import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking'); // checking, success, error
  const [attempts, setAttempts] = useState(0);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      pollPaymentStatus();
    } else {
      setStatus('error');
    }
  }, [sessionId]);

  const pollPaymentStatus = async () => {
    const maxAttempts = 5;
    const pollInterval = 2000; // 2 seconds

    if (attempts >= maxAttempts) {
      setStatus('error');
      toast({
        title: "Tempo esgotado",
        description: "Verifique seu dashboard em alguns minutos.",
        variant: "destructive"
      });
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/stripe/status/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success && data.payment_status === 'paid') {
        setStatus('success');
        toast({
          title: "✅ Pagamento Confirmado!",
          description: "R$ 50,00 pagos com sucesso. Você receberá propostas de mecânicos em breve."
        });
        
        // Clear any pending booking
        localStorage.removeItem('pendingBooking');

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else if (data.status === 'expired') {
        setStatus('error');
      } else {
        // Still pending, continue polling
        setAttempts(attempts + 1);
        setTimeout(pollPaymentStatus, pollInterval);
      }
    } catch (error) {
      console.error('Error checking payment:', error);
      setStatus('error');
    }
  };

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <Loader2 className="h-16 w-16 text-[#635BFF] animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-2">
            Verificando Pagamento...
          </h2>
          <p className="text-gray-600">
            Aguarde enquanto confirmamos seu pagamento com o Stripe.
          </p>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#0E1A2C] mb-2">
            Pagamento Confirmado!
          </h2>
          <p className="text-gray-600 mb-4">
            Sua pré-reserva de <strong>R$ 50,00</strong> foi processada com sucesso.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              ✓ Você será redirecionado para o dashboard<br/>
              ✓ Em breve receberá propostas de mecânicos<br/>
              ✓ O valor será descontado da conta final
            </p>
          </div>
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-[#27AE60] hover:bg-[#229954]"
          >
            Ir para Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#0E1A2C] mb-2">
          Erro no Pagamento
        </h2>
        <p className="text-gray-600 mb-6">
          Não foi possível processar seu pagamento. Por favor, tente novamente.
        </p>
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/quote')}
            className="w-full bg-[#1EC6C6] hover:bg-[#1AB5B5]"
          >
            Tentar Novamente
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="w-full"
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};
