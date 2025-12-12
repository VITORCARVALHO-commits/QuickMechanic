import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Copy, Check, QrCode, Clock } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export const PaymentPIX = ({ amount, onPaymentComplete, onCancel }) => {
  const [pixCode, setPixCode] = useState('');
  const [pixQR, setPixQR] = useState('');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutos
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generatePIX();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const generatePIX = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/payments/pix/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount,
          description: 'QuickMechanic - Pré-reserva'
        })
      });

      const data = await response.json();

      if (data.success) {
        setPixCode(data.data.pix_code);
        setPixQR(data.data.pix_qr);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao gerar código PIX",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast({
      title: "✅ Copiado!",
      description: "Código PIX copiado para área de transferência"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirmPayment = () => {
    // Mock: simula pagamento aprovado
    toast({
      title: "✅ Pagamento Confirmado!",
      description: "PIX recebido com sucesso"
    });
    onPaymentComplete();
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1EC6C6] mx-auto"></div>
        <p className="mt-4 text-gray-600">Gerando código PIX...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#1EC6C6] rounded-full flex items-center justify-center mx-auto mb-4">
          <QrCode className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#0E1A2C] mb-2">Pagamento via PIX</h2>
        <div className="text-3xl font-bold text-[#1EC6C6] mb-2">
          R$ {amount.toFixed(2).replace('.', ',')}
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          Expira em: {formatTime(timeLeft)}
        </div>
      </div>

      {/* QR Code Mock */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-4">
        <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <QrCode className="h-24 w-24 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Escaneie o QR Code</p>
            <p className="text-xs text-gray-400 mt-1">com seu app de banco</p>
          </div>
        </div>
      </div>

      {/* PIX Code */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          Ou copie o código PIX:
        </label>
        <div className="flex gap-2">
          <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <div className="text-xs font-mono text-gray-600 truncate">
              {pixCode.slice(0, 40)}...
            </div>
          </div>
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="flex-shrink-0"
          >
            {copied ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-sm text-blue-900 mb-2">Como pagar:</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Abra o app do seu banco</li>
          <li>Escolha pagar com PIX</li>
          <li>Escaneie o QR Code ou cole o código</li>
          <li>Confirme o pagamento</li>
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleConfirmPayment}
          className="w-full bg-[#27AE60] hover:bg-[#229954] text-white h-12"
        >
          <Check className="h-5 w-5 mr-2" />
          Já Paguei
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="w-full"
        >
          Cancelar
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        * Este é um pagamento simulado (mock). Em produção, integraria com Mercado Pago, PagSeguro, etc.
      </p>
    </Card>
  );
};
