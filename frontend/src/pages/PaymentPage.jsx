import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { createPayment } from '../services/api';
import { toast } from '../hooks/use-toast';
import { CreditCard, Loader2, CheckCircle, Shield } from 'lucide-react';

export const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quote } = location.state || {};
  const [processing, setProcessing] = useState(false);

  if (!quote) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600">No payment information found</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4 bg-[#1EC6C6] hover:bg-[#1AB5B5]">
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await createPayment({
        quote_id: quote.id,
        amount: quote.final_price || quote.estimated_price,
        payment_method: 'mock'
      });

      if (response.success) {
        toast({
          title: "Payment successful!",
          description: "Your service has been booked"
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#1EC6C6] rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#0E1A2C] mb-2">Payment</h1>
            <p className="text-gray-600">Complete your booking</p>
          </div>

          {/* Quote Summary */}
          <div className="bg-[#F5F7FA] rounded-lg p-6 mb-6">
            <h3 className="font-bold text-[#0E1A2C] mb-4">Booking Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-semibold">{quote.make} {quote.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-semibold">{quote.service.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-semibold">{quote.location}</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-[#0E1A2C]">Total:</span>
                  <span className="text-3xl font-bold text-[#1EC6C6]">
                    R$ {quote.final_price || quote.estimated_price}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mock Payment Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 text-center">
              <strong>Demo Mode:</strong> This is a simulated payment. No real transaction will occur.
            </p>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
            <Shield className="h-5 w-5 text-[#27AE60]" />
            <span className="text-sm">Secure payment powered by ClickMecanico</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="flex-1"
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="flex-1 bg-[#27AE60] hover:bg-[#229954] text-white"
            >
              {processing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirm Payment
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
